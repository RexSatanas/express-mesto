const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Жак Ив-Кусто",
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: "Исследователь",
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    validate: {
      validator(avatar) {
        return validator.isUrl(avatar);
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findAndCheck(
  email,
  password,
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new AuthError('Неправильные почта или пароль');
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
