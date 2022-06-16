function createRandomCode(chars = "") {
  // Create a recursive function
  const lowerLetters = "abcdefghijklmnopqrstuvwxyz";
  const upperLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  return {
    lowerLetters() {
      return createRandomCode(chars + lowerLetters);
    },

    upperLetters() {
      return createRandomCode(chars + upperLetters);
    },

    numbers() {
      return createRandomCode(chars + numbers);
    },

    specialChars() {
      return createRandomCode(chars + specialChars);
    },

    generate(length) {
      const code = Array.from({ length }, () => null).reduce((code) => {
        const index = Math.floor(Math.random() * (chars.length - 1));
        code += chars[index];
        return code;
      }, "");

      return code;
    },
  };
}

function getFullUrl(request, { withPath } = { withPath: false }) {
  return `${request.protocol}://${request.get("host")}${withPath ? request.originalUrl : ""}`;
}

module.exports = { createRandomCode, getFullUrl };
