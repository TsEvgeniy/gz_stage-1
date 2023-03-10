import express from 'express';
import {
  validateRequest,
  currentUser
} from '@good_zone/common';
import {
  addAddress,
  addMoreUserData,
  getAllUserAddresses,
  getCurrentUser,
  makeAddressDefault,
  userProfile,
  userSignin,
  userSignout,
  userSignup
} from "../controllers/user";

const router = express.Router();

router.post('/api/users/signup', validateRequest, userSignup);
router.get('/api/users/currentuser', currentUser, getCurrentUser);
router.post('/api/users/signin', validateRequest, userSignin);
router.post('/api/users/signout', userSignout);
router.get('/api/users/profile', currentUser, userProfile);
router.post('/api/users/address', currentUser, addAddress);
router.post('/api/users/address/:id', currentUser, makeAddressDefault);
router.get('/api/users/addresses', currentUser, getAllUserAddresses);
router.post('/api/users/additional-info', currentUser, addMoreUserData);

export { router as userRouter };