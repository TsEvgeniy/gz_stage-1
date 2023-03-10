import mongoose from 'mongoose';
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
// import { TicketCreatedListener} from "./events/listeners/ticket-create-listener";
import { ProductAddToWishlistListener } from "./events/listeners/product-add-to-wishlist-listener";
import {ProductRemoveFromWishlistListener} from "./events/listeners/product-remove-from-wishlist-listener";
import {ProductAddToCartListener} from "./events/listeners/product-add-to-cart-listener";
import {ProductRemoveFromCartListener} from "./events/listeners/product-remove-from-cart-listener";


const PORT = 3000;
const start = async () => {

  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined!');
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined!');
  if (!process.env.NATS_CLIENT_ID) throw new Error('NATS_CLIENT_ID must be defined!');
  if (!process.env.NATS_URL) throw new Error('NATS_URL must be defined!');
  if (!process.env.NATS_CLUSTER_ID) throw new Error('NATS_CLUSTER_ID must be defined!');

  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    // new TicketCreatedListener(natsWrapper.client).listen();
    new ProductAddToWishlistListener(natsWrapper.client).listen();
    new ProductRemoveFromWishlistListener(natsWrapper.client).listen();
    new ProductAddToCartListener(natsWrapper.client).listen();
    new ProductRemoveFromCartListener(natsWrapper.client).listen();

    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB_auth...')
  }
  catch (err) {
    console.error(err);
  }

  app.listen(PORT, () => {
    console.log(`Service starts on ${PORT}...`);
  });
};

start();