import mongoose, { Schema } from "mongoose";
//@ts-ignore
import slug from 'mongoose-slug-updater';

interface BrandAttrs {
  name: string;
  desc: string;
  active: boolean;
  image: string;
  meta: object;
  external_id: number;
}

interface BrandDoc extends mongoose.Document {
  name: string;
  desc: string;
  active: boolean;
  slug: string;
  image: string;
  meta: object;
  external_id: number;
  products: object;
}

interface BrandModel extends mongoose.Model<BrandDoc> {
  build(attrs: BrandAttrs): BrandDoc;
}

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    slug: 'name',
    permament: true,
    text: true
  },
  desc: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
  meta: {
    title: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    tags: {
      type: String,
      default: ""
    }
  },
  external_id: {
    type: Number,
  },
  active: {
    type: Boolean,
    required: true
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]
},{
  timestamps: true
});

brandSchema.plugin(slug);

brandSchema.statics.build = (attrs: BrandAttrs) => {
  return new Brand(attrs);
};

const Brand = mongoose.model<BrandDoc, BrandModel>('Brand', brandSchema);

export { Brand };