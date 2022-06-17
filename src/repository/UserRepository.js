const prisma = require("../services/database");
const { MailService } = require("../services/email");
const JwtService = require("../services/jwt");
const Logger = require("../utils/logger");
const { createRandomCode } = require("../utils/general");

const selectUserFields = {
  id: true,
  name: true,
  email: true,
  avatar: true,
  createdAt: true,
  updatedAt: true,
  status: true,
};

const UserRepository = {
  async findAll() {
    return await prisma.user.findMany({
      select: selectUserFields,
    });
  },

  async findOne(id) {
    id = Number(id);

    return prisma.user.findFirst({ where: { id }, select: selectUserFields });
  },

  async create(data) {
    if (!data.name) throw new Error("Nome é obrigatório!");
    if (!data.email) throw new Error("E-mail é obrigatório!");
    if (!data.password) throw new Error("Senha é obrigatória!");

    const userWithEmail = await prisma.user.findFirst({ where: { email: data.email } });

    if (userWithEmail && userWithEmail.status === "ACTIVE") throw new Error("Já existe usuário com este e-mail!");

    try {
      const user =
        userWithEmail ||
        (await prisma.user.create({
          data: {
            name: data.name,
            email: data.email,
            password: data.password,
          },
          select: selectUserFields,
        }));
      Logger.success(`Usuário ${user.name} criado com sucesso!`);

      return user;
    } catch (error) {
      Logger.error("Erro ao criar usuário:", error);
      throw error;
    }
  },

  async createAuthToken(userId) {
    const token = await JwtService.sign({ id: userId });

    return token;
  },

  async me(token) {
    const payload = await JwtService.verify(token);

    if (!payload || !payload.id) return null;

    const user = await prisma.user.findFirst({ where: { id: payload.id }, select: selectUserFields });
    return user;
  },

  async login(data) {
    if (!data.email) throw new Error("E-mail é obrigatório!");
    if (!data.password) throw new Error("Senha é obrigatória!");

    const user = await prisma.user.findFirst({ where: { email: data.email } });

    if (!user) throw new Error("E-mail não encontrado!");
    if (user.status !== "ACTIVE") throw new Error("Usuário inválido!");
    if (user.password !== data.password) throw new Error("Senha incorreta!");

    const token = await UserRepository.createAuthToken(user.id);

    delete user.password;
    return { user, token };
  },

  async register(data, origin) {
    const user = await UserRepository.create(data);

    await prisma.confirmToken.updateMany({
      where: { userId: user.id },
      data: { status: "EXPIRED" },
    });

    const code = createRandomCode().numbers().generate(6);
    await prisma.confirmToken.create({ data: { token: code, userId: user.id } });

    const html = MailService.template("register", {
      name: user.name,
      url: `${origin}/confirm-register?email=${user.email}&code=${code}`,
      code,
    });
    await MailService.sendMail(user.email, `Chat DevPlay - Confirme seu registro ${user.name}`, html);

    return user;
  },

  async confirmRegister(email, code) {
    const user = await prisma.user.findFirst({ where: { email }, select: selectUserFields });
    if (!user) throw new Error("Usuário não encontrado!");

    const confirmToken = await prisma.confirmToken.findFirst({ where: { userId: user.id, token: code } });

    if (!confirmToken) throw new Error("Token inválido!");
    if (confirmToken.status !== "PENDING") throw new Error("Token inválido!");

    await prisma.confirmToken.update({ where: { id: confirmToken.id }, data: { status: "CONFIRMED" } });
    await prisma.user.update({ where: { id: user.id }, data: { status: "ACTIVE" } });

    return user;
  },

  async requestResetPasswordToken(email, origin) {
    const user = await prisma.user.findFirst({ where: { email }, select: selectUserFields });

    if (!user) throw new Error("Usuário não encontrado!");

    const code = createRandomCode().numbers().lowerLetters().upperLetters().generate(24);
    await prisma.resetPasswordToken.updateMany({
      where: { userId: user.id },
      data: { status: "EXPIRED" },
    });
    await prisma.resetPasswordToken.create({ data: { token: code, userId: user.id } });

    const html = MailService.template("reset-password", {
      name: user.name,
      url: `${origin}/reset-password?code=${code}`,
    });
    await MailService.sendMail(user.email, `Chat DevPlay - Redefinição de senha ${user.name}`, html);

    return user;
  },

  async confirmResetPassword(data) {
    const token = await prisma.resetPasswordToken.findFirst({
      where: { token: data.code, status: "PENDING" },
      include: { user: { select: selectUserFields } },
    });
    if (!token) throw new Error("Token inválido!");

    await prisma.resetPasswordToken.update({ where: { id: token.id }, data: { status: "CONFIRMED" } });
    await prisma.user.update({ where: { id: token.userId }, data: { password: data.password } });

    return token.user;
  },

  async update(id, user) {
    id = Number(id);

    if (user.email) {
      const userWithEmail = await prisma.user.findFirst({ where: { email: user.email } });

      if (userWithEmail && userWithEmail !== id) throw new Error("Já existe usuário com este e-mail!");
    }

    return await prisma.user.update({
      where: { id },
      data: user,
      select: selectUserFields,
    });
  },

  async delete(id) {
    id = Number(id);

    return await prisma.user.delete({
      where: { id },
      select: selectUserFields,
    });
  },

  async findUserRooms(id, filter) {
    id = Number(id);

    const where = { users: { some: { userId: id } } };

    if (filter) {
      where.OR = [{ name: { contains: filter } }, { code: { contains: filter } }];
    }

    return await prisma.room.findMany({ where });
  },

  async addUserToRoom(userId, code) {
    userId = Number(userId);

    const room = await prisma.room.findFirst({ where: { code } });

    if (!room) throw new Error("Sala não encontrada!");

    const joinedRoom = await prisma.userRoom.create({ data: { userId, roomId: room.id } });

    return joinedRoom;
  },

  async changePassword(id, { oldPassword, newPassword }) {
    id = Number(id);

    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) throw new Error("Usuário não encontrado!");

    if (user.password !== oldPassword) throw new Error("Senha incorreta!");

    await prisma.user.update({ where: { id }, data: { password: newPassword } });

    delete user.password;
    return user;
  },

  async findUserRoom(userId, roomCode) {
    userId = Number(userId);

    const userRoom = await prisma.userRoom.findFirst({
      where: { userId, room: { code: roomCode } },
      include: { room: true },
    });

    if (!userRoom) return null;

    return userRoom.room;
  },
};

module.exports = UserRepository;
