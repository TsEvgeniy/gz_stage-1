import { Request, Response } from "express";
import { Category } from "../models/category";

export const getCategories = async (req: Request, res: Response) => {
  const categories = await Category.find();

  res.send(categories);
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, desc, active, image, meta } = req.body;
  const category = Category.build({
    name, desc, active, image, meta
  });

  await category.save();

  res.status(201).send(category);
};