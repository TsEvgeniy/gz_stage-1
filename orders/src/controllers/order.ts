import {Request, Response} from 'express';
import {Order, OrderStatus} from '../models/order';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError
} from "@good_zone/common";
import {OrderCancelledPublisher} from "../events/publishers/order-cancelled-publisher";
import {natsWrapper} from "../nats-wrapper";
import {Product} from "../models/product";
import {OrderCreatedPublisher} from "../events/publishers/order-created-publisher";
import { UserOrderCreatedPublisher } from '../events/publishers/user-order-created-publisher';

export const getOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id
  }).populate("product");

  res.send(orders);
};

export const deleteOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId).populate("product");

  if (!order) throw new NotFoundError();
  if(order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

  order.status = OrderStatus.Cancelled;

  await order.save();

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    product: {
      id: order.product.id,
    }
  });

  res.status(204).send(order);
};

export const createOrder = async (req: Request, res: Response) => {
  const EXPIRATION_WINDOW_SECONDS = 1 * 60;

  const { productId } = req.body;
  const product = await Product.findById(productId);

  if (!product) throw new NotFoundError();

  const isReserved = await product.isReserved();

  if (isReserved) throw new BadRequestError("Product is already reserved");

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    product,
  });
  await order.save();

  new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(),
    product: {
      id: product.id,
      price: product.price,
    },
  });

  new UserOrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    status: order.status,
    userId: order.userId,
    product: {
      id: product.id,
      price: product.price,
      title: product.title
    },
  })

  res.status(201).send(order);
};

export const getOrder = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate("product");

  if (!order) throw new NotFoundError();
  if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();

  res.send(order);
};