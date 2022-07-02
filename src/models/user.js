import mongoose from 'mongoose';
import { Password } from '../utils/password';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: false,
      default: 'user'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        /* delete ret.role; */
        delete ret.createdAt;
        delete ret.__v;
      }
    }
  }
);

userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs) => {
  return new User(attrs);
};

const User = mongoose.model('User', userSchema);

export { User };
