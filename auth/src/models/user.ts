import mongoose, { Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Password } from '../services/password';

interface UserAttrs {
  phone: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
  phone: string;
  password: string;
  email: string;
  name: string;
  surname: string;
  date: string; // date of birth
  cashback: string; // ?number?
  code: string; // additional field
  wishlist: object;
  address: object;
  cart: object;
  orders: object;
}

//@ts-ignore
const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String },
    name: { type: String },
    surname: { type: String },
    date: { type: String },
    cashback: { type: String },
    code: { type: String },
    address: [{ type: Schema.Types.ObjectId, ref: 'Address', required: true }],
    wishlist: [
      {
        id: { type: String, required: true },
        title: { type: String },
        price: { type: Number },
      },
    ],
    cart: [
      {
        product: {
          id: { type: String, required: true },
          title: { type: String },
          price: { type: Number },
        },
      },
    ],
    orders: [
      {
        id: { type: String, required: true },
        status: { type: String },
        version: { type: Number },
        product: {
          id: { type: String, required: true },
          title: { type: String },
          price: { type: Number },
        },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
