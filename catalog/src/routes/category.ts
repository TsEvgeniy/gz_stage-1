import express from "express";
import {createCategory, getCategories} from "../controllers/category";

const BASE_URL = '/api/catalog';

const router = express.Router();

router.get(`${BASE_URL}/categories`, getCategories);
router.post(`${BASE_URL}/category-create`, createCategory);

export { router as categoryRouter }