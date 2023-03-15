import mongoose, { Schema } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
//@ts-ignore
import slug from 'mongoose-slug-updater';

interface ProductAttrs {
  title: string;
  price: number;
  desc: string;
  active: boolean;
  brand: string;
  category: string;
  external_id: number;
  artikul: string;
  meta: object;
  properties: object;
  image: string;
  gallery: object;
  ikpu_code: string;
  mark_code: string;
  in_stock: object;
  userId: string;
}

interface ProductDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  desc: string;
  active: boolean;
  brand: string;
  category: string;
  external_id: number;
  artikul: string;
  meta: object;
  properties: object;
  image: string;
  gallery: object;
  ikpu_code: string;
  mark_code: string;
  in_stock: object;
  orderId?: string;
  version: number;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      slug: 'title',
      permament: true,
      text: true,
    },
    desc: { type: String },
    active: { type: Boolean },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    external_id: { type: Number },
    artikul: { type: String },
    meta: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      tags: { type: String, default: '' },
    },
    properties: [
      {
        property: { type: String },
        value: { type: String },
      },
    ],
    image: { type: String },
    gallery: [{ type: String }],
    ikpu_code: {
      type: String,
      default: '',
    },
    mark_code: {
      type: String,
      default: '',
    },
    in_stock: {
      samarkand: {
        type: Boolean,
        default: false,
      },
      bukhara: {
        type: Boolean,
        default: false,
      },
      tashkent_city: {
        type: Boolean,
        default: false,
      },
    },
    price: { type: Number },
    orderId: { type: String },
    userId: { type: String },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

productSchema.plugin(slug);

productSchema.set('versionKey', 'version');
productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  'Product',
  productSchema
);

export { Product };
