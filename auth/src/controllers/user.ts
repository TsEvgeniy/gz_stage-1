import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Address } from "../models/address";
import { BadRequestError } from "@good_zone/common";
import { Password } from "../services/password";

export const userSignup = async (req: Request, res: Response) => {
  const { phone, password } = req.body;
  const existingUser = await User.findOne({ phone });

  if (existingUser) throw new BadRequestError('Phone is in use!');

  const user = User.build({
    phone,
    password
  });

  await user.save();

  const userJwt = jwt.sign({
    id: user.id,
    phone: user.phone
  }, process.env.JWT_KEY!);

  req.session = {
    jwt: userJwt
  };

  res.status(201).send(user);
};

export const getCurrentUser = async (req: Request, res: Response) => {
  res.send({ currentUser: req.currentUser || null });
};

export const userSignin = async (req: Request, res: Response) => {
  const { phone, password } = req.body;
  const existingUser = await User.findOne({ phone });

  if (!existingUser) throw new BadRequestError('Invalid creds!');

  const passwordMatch = await Password.compare(existingUser.password, password);

  if (!passwordMatch) throw new BadRequestError('Invalid creds!');

  const userJwt = jwt.sign({
    id: existingUser.id,
    phone: existingUser.phone
  }, process.env.JWT_KEY!);

  req.session = {
    jwt: userJwt
  };

  res.status(200).send(existingUser);
};

export const userSignout = async (req: Request, res: Response) => {
  req.session = null;
  res.send({})
};

export const userProfile = async (req: Request, res: Response) => {
  const profile = await User.findById(req.currentUser!.id)
    .populate("address");
  res.send(profile);
};

export const addAddress = async (req: Request, res: Response) => {
  const { street, postalCode, city, country } = req.body;
  const profile = await User.findById(req.currentUser!.id);

  if (!profile) throw new Error('not found!'); // FIX!!!!!!!!

  let userAddress = await Address.find({ customer: req.currentUser!.id });

  if (userAddress.length >= 1) {
    // const newValue = { $set: { isMain: false } };
    await Address.updateMany({ customer: req.currentUser!.id }, { $set: { isMain: false }});

    const newAddress = Address.build({
      street,
      postalCode,
      city,
      country,
      customer: req.currentUser!.id
    });

    await newAddress.save();

    //@ts-ignore
    profile.address.push(newAddress);
    await profile.save();
  } else {
    const newAddress = Address.build({
      street,
      postalCode,
      city,
      country,
      customer: req.currentUser!.id
    });

    await newAddress.save();

    //@ts-ignore
    profile.address.push(newAddress);

    await profile.save();
  }

  res.send(profile);
};

export const makeAddressDefault = async (req: Request, res: Response) => {
  const profile = await User.findById(req.currentUser!.id);

  if (!profile) throw new Error('not found!');

  await Address.updateMany({ customer: req.currentUser!.id }, { $set: { isMain: false }})
  await Address.updateOne( { _id: req.params.id }, { isMain: true });

  res.send({});
};

export const getAllUserAddresses = async (req: Request, res: Response) => {
  const addresses = await Address.find({ customer: req.currentUser!.id });

  res.send(addresses);
};

export const addMoreUserData = async (req: Request, res: Response) => {
  const { name, surname, email, date } = req.body;
  const profile = await User.findById(req.currentUser!.id);

  if (!profile) throw new Error('not found!');

  profile.set({
    name,
    surname,
    email,
    date
  });

  await profile.save();

  res.send(profile);
};