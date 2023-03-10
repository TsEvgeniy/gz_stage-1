import { Request, Response} from 'express';
import { Brand } from "../models/brand";

export const getBrands = async (req: Request, res: Response) => {
  const brands = await Brand.find();

  res.send(brands);
};

export const createBrand = async (req: Request, res: Response) => {
  const { name, desc, active, image, meta, external_id } = req.body;
  const brand = Brand.build({
    name, desc, active, image, meta, external_id
  });

  await brand.save();

  res.status(201).send(brand)
};