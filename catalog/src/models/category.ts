import mongoose, { Schema } from "mongoose";
//@ts-ignore
import slug from 'mongoose-slug-updater';

interface CategoryAttrs {
  name: string;
  desc: string;
  active: boolean;
  image: string;
  meta: object;
}

interface CategoryDoc extends mongoose.Document {
  name: string;
  desc: string;
  active: boolean;
  slug: string;
  image: string;
  meta: object;
  products: object;
}

interface CategoryModel extends mongoose.Model<CategoryDoc> {
  build(attrs: CategoryAttrs): CategoryDoc
}

const categorySchema = new mongoose.Schema({
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
      default: "",
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
}, {
  timestamps: true
});

categorySchema.plugin(slug);

categorySchema.statics.build = (attrs: CategoryAttrs) => {
  return new Category(attrs);
};

const Category = mongoose.model<CategoryDoc, CategoryModel>('Category', categorySchema);

export { Category };