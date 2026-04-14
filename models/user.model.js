
import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin','manager', 'employee'],
    default: 'employee'
  }
});

const User = mongoose.model('User', userSchema);

export default User;