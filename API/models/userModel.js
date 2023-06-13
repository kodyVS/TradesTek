const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: [true, "Please tell us your name!"],
    unique: true,
  },
  Email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  Photo: {
    asset_id: String,
    public_id: String,
    version: Number,
    version_id: String,
    signature: String,
    width: Number,
    height: Number,
    format: String,
    resource_type: String,
    created_at: String,
    tags: [],
    bytes: Number,
    etag: String,
    placeholder: Boolean,
    url: String,
    secure_url: String,
    access_mode: String,
    iconURL: String,
  },
  UserRole: {
    type: String,
    default: "User",
  },
  Password: {
    type: String,
    required: [true, "Please provide a Password"],
    minlength: 8,
    select: false,
  },
  PasswordConfirm: {
    type: String,
    required: [true, "Please confirm your Password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.Password;
      },
      message: "Passwords are not the same!",
    },
  },
  PasswordChangedAt: Date,
  PasswordResetToken: String,
  PasswordResetExpires: Date,
  Active: {
    type: Boolean,
    default: true,
  },
  EmployeeReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employees",
  },
});

userSchema.pre("save", async function (next) {
  // Only run this function if Password was actually modified
  if (!this.isModified("Password")) return next();

  // Hash the Password with cost of 12
  this.Password = await bcrypt.hash(this.Password, 12);

  // Delete PasswordConfirm field
  this.PasswordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("Password") || this.isNew) return next();

  this.PasswordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ Active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.PasswordChangedAt) {
    const changedTimestamp = parseInt(
      this.PasswordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.PasswordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.PasswordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
