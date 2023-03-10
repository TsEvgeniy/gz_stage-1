import express from "express";
import {createBrand, getBrands} from "../controllers/brand";

const BASE_URL = '/api/catalog';

const router = express.Router();

router.get(`${BASE_URL}/brands`, getBrands);
router.post(`${BASE_URL}/brand-create`, createBrand);

export { router as brandRouter }