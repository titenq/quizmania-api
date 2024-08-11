import mongoose from '../db';
import { decrypt, encrypt } from '../helpers/cryptography';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  picture: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'users' });

UserSchema.pre('save', async function (next) {
  const emailEncrypt = encrypt(this.email);
  this.email = emailEncrypt;

  next();
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  user.email = decrypt(user.email);

  return user;
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
