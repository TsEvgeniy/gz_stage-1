import {Listener, ProductRemoveFromWishlistEvent, Subjects} from "@good_zone/common";
import { queueGroupName } from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {User} from "../../models/user";
export class ProductRemoveFromWishlistListener extends Listener<ProductRemoveFromWishlistEvent> {
  subject: Subjects.ProductRemoveFromWishlist = Subjects.ProductRemoveFromWishlist;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductRemoveFromWishlistEvent["data"], msg: Message) {
    const { id, title, price, userId } = data;
    const product = { id, title, price, userId };
    const profile = await User.findById(userId);

    if(!profile) throw new Error ('not found!'); //FIX!!!!!!!!!!!

    let wishlist = profile.wishlist;
    //@ts-ignore
    if (wishlist.length > 0) {
      //@ts-ignore
      let isExist = false;
      //@ts-ignore
      wishlist.map(item => {
        //@ts-ignore
        if (item.id.toString() === product.id.toString()) {
          //@ts-ignore
          const index = wishlist.indexOf(item);
          //@ts-ignore
          wishlist.splice(index,1);
          //@ts-ignore
          isExist = true;
        }
      });
//@ts-ignore
      if (!isExist) {
        //@ts-ignore
        wishlist.push(product);
      }
    } else {
      //@ts-ignore
      wishlist.push(product);
    }
//@ts-ignore
    profile.wishlist = wishlist;

    const profileResult = await profile.save();

    msg.ack();
  }
}