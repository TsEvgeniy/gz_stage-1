import { Request, Response } from "express";
import { Product } from "../models/product";
import { Brand } from "../models/brand";
import { Category } from "../models/category";
import {natsWrapper} from "../nats-wrapper";
import {BadRequestError, NotAuthorizedError, NotFoundError} from "@good_zone/common";
import {ProductAddToWishlistPublisher} from "../events/publishers/product-add-to-wishlist-publisher";
import {ProductRemoveFromWishlistPublisher} from "../events/publishers/product-remove-from-wishlist-publisher";
import { ProductAddToCartPublisher } from "../events/publishers/product-add-to-cart-publisher";
import { ProductRemoveFromCartPublisher} from "../events/publishers/product-remove-from-cart-publisher";
import {ProductCreatedPublisher} from "../events/publishers/product-created-publisher";
import { ProductUpdatedPublisher } from "../events/publishers/product-updated-publisher";

export const getProducts = async (req: Request, res: Response) => {
  let products: Array<{ id: string, price: number, image: string, title: string }> = [];
  const allProducts = await Product.find();

  allProducts.forEach(element => {
    products.push({
      title: element.title,
      image: element.image,
      price: element.price,
      id: element.id
    })
  });

  res.send(products);
};

export const createProduct = async (req: Request, res: Response) => {
  const {
    title, price, desc,
    active, brand, category,
    external_id, artikul, meta,
    properties, image, gallery,
    ikpu_code, mark_code, in_stock
  } = req.body;

  const product = Product.build({
    title,
    price,
    desc,
    active,
    brand,
    category,
    external_id,
    artikul,
    meta,
    properties,
    image,
    gallery,
    ikpu_code,
    mark_code,
    in_stock,
    userId: req.currentUser!.id
  });

  await product.save();

  // FIX CHECKING IF BRAND AND CATEGORY IS EXIST!!!!!!!!!!

  const brands = await Brand.findById(brand);

  if (!brands) throw new BadRequestError('There is no such brand!');

  //@ts-ignore
  brands.products.push(product);
  //@ts-ignore
  await brands.save()

  const categories = await Category.findById(category);

  if (!categories) throw new BadRequestError('There is no such category!!');

  //@ts-ignore
  categories.products.push(product);
  //@ts-ignore
  await categories.save();

  await new ProductCreatedPublisher(natsWrapper.client).publish({
    id: product.id,
    title: product.title,
    price: product.price,
    version: product.version,
    userId: '',
  });

  res.status(201).send(product);
};

// FIX GET PRODUCT TO AVOID BRAND->PRODUCTS AND CATEGORY->PRODUCTS

export const getProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id).populate("brand category");

  if(!product) throw new NotFoundError();

  res.send(product);
};

export const getProductsByBrand = async (req: Request, res: Response) => {
  const brand = await Brand.findOne({ slug: req.params.brand }).populate('products');
  let allProducts: Array<{ id: string, price: number, image: string, title: string }> = [];

  //@ts-ignore
  brand!.products.forEach(element => {
    allProducts.push({
      title: element.title,
      image: element.image,
      price: element.price,
      id: element.id
    })
  });

  res.send(allProducts);
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  const category = await Category.findOne({ slug: req.params.category }).populate('products');
  let allProducts: Array<{ id: string, price: number, image: string, title: string }> = [];

  //@ts-ignore
  category!.products.forEach(element => {
    allProducts.push({
      title: element.title,
      image: element.image,
      price: element.price,
      id: element.id
    })
  });

  res.send(allProducts);
};

export const getSelectedProducts = async (req: Request, res: Response) => {
  const { selectedIds } = req.body;
  const products = await Product
    .find()
    .where('_id')
    //@ts-ignore
    .in(selectedIds.map(_id => _id))
    .exec();

  res.send(products);
}

export const updateProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) throw new NotFoundError();
  // if (product.orderId) throw new BadRequestError('Cannot edit a reserved ticket!');
  // if (product.userId !== req.currentUser!.id) throw new NotAuthorizedError();

  product.set({
    title: req.body.title,
    price: req.body.price
  });

  await product.save();

  new ProductUpdatedPublisher(natsWrapper.client).publish({
    id: product.id,
    title: product.title,
    price: product.price,
    userId: '',
    version: product.version
  });

  res.send(product);
};

export const addProductToWishlist = async (req: Request, res: Response) => {
  const product  = await Product.findById(req.body.id);

  if(!product) throw new BadRequestError('There is no product!');

  await new ProductAddToWishlistPublisher(natsWrapper.client).publish({
    id: product.id,
    title: product.title,
    price: product.price,
    userId: req.currentUser!.id
  });

  res.send(product);
};

export const deleteFromWishlist = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) throw new BadRequestError('There is no product!');

  await new ProductRemoveFromWishlistPublisher(natsWrapper.client).publish({
    id: product.id,
    title: product.title,
    price: product.price,
    userId: req.currentUser!.id
  });

  res.send({});
};

export const addProductToCart = async (req: Request, res: Response) => {
  const product = await Product.findById(req.body.id);

  if (!product) throw new BadRequestError('There is no product!');

  await new ProductAddToCartPublisher(natsWrapper.client).publish({
    id: product.id,
    title: product.title,
    price: product.price,
    userId: req.currentUser!.id
  });

  res.send(product);

};

export const removeFromCart = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (!product) throw new BadRequestError('There is no product!');

  await new ProductRemoveFromCartPublisher(natsWrapper.client).publish({
    id: product.id,
    title: product.title,
    price: product.price,
    userId: req.currentUser!.id
  });

  res.send({});
}