import mongoose from "mongoose";

interface AddressAttrs {
  street: string;
  postalCode: string;
  city: string;
  country: string;
  customer: string;
}

interface AddressDoc extends mongoose.Document {
  street: string;
  postalCode: string;
  city: string;
  country: string;
  customer: string;
  isMain: boolean;
}

interface AddressModel extends mongoose.Model<AddressDoc> {
  build(attrs: AddressAttrs): AddressDoc;
}

const addressSchema = new mongoose.Schema({
  street: { type: String },
  postalCode: { type: String },
  city: { type: String },
  country: { type: String },
  isMain: { type: Boolean, default: true },
  customer: { type: String },
}, {
  timestamps: true
});

addressSchema.statics.build = (attrs: AddressAttrs) => {
  return new Address(attrs);
};

const Address = mongoose.model<AddressDoc, AddressModel>('Address', addressSchema);

export { Address };

