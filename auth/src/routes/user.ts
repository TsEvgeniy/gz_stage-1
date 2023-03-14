import express from 'express';
import { validateRequest, currentUser } from '@good_zone/common';
import {
  addAddress,
  addMoreUserData,
  getAllUserAddresses,
  getCurrentUser,
  makeAddressDefault,
  userProfile,
  userSignin,
  userSignout,
  userSignup,
  updateUserData,
  updateUserAddress,
  deleteUserAddress,
  getAllUsers,
} from '../controllers/user';

const router = express.Router();

router.get('/api/users/', getAllUsers);

router.post('/api/users/signup', validateRequest, userSignup);
router.get('/api/users/currentuser', currentUser, getCurrentUser);
router.post('/api/users/signin', validateRequest, userSignin);
router.post('/api/users/signout', userSignout);
router.get('/api/users/profile', currentUser, userProfile);
router.post('/api/users/address', currentUser, addAddress);
router.post('/api/users/address/:id', currentUser, makeAddressDefault);
router.get('/api/users/addresses', currentUser, getAllUserAddresses);
router.post('/api/users/additional-info', currentUser, addMoreUserData);
router.put('/api/users/additional-info', currentUser, updateUserData);
router.put('/api/users/address', currentUser, updateUserAddress);
router.delete('/api/users/address/:id', currentUser, deleteUserAddress);

export { router as userRouter };
