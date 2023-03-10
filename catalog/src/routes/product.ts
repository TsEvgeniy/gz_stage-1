import express from "express";
import {
  addProductToWishlist,
  deleteFromWishlist,
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  addProductToCart,
  removeFromCart,
  getProductsByBrand,
  getProductsByCategory,
  getSelectedProducts
} from "../controllers/product";
import {
  requireAuth,
  validateRequest
} from "@good_zone/common";

const router = express.Router();

router.get('/api/catalog/products', getProducts);
router.post('/api/catalog/product-create', requireAuth, validateRequest, createProduct);
router.get('/api/catalog/product/:id', getProduct);
router.put('/api/catalog/product/:id', requireAuth, validateRequest, updateProduct);
router.put('/api/catalog/wishlist', requireAuth, addProductToWishlist);
router.delete('/api/catalog/wishlist/:id', requireAuth, deleteFromWishlist);
router.put('/api/catalog/cart', requireAuth, addProductToCart);
router.delete('/api/catalog/cart/:id', requireAuth, removeFromCart);
router.get('/api/catalog/products-by-brand/:brand', getProductsByBrand);
router.get('/api/catalog/products-by-category/:category', getProductsByCategory);
router.post('/api/catalog/ids', getSelectedProducts);




export { router as productRouter };