import {Listener, ProductAddToCartEvent, Subjects} from "@good_zone/common";
import { Message } from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {User} from "../../models/user";

export class ProductAddToCartListener extends Listener<ProductAddToCartEvent> {
  subject: Subjects.ProductAddToCart = Subjects.ProductAddToCart;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductAddToCartEvent["data"], msg: Message) {
    const isRemove = false;
    const { id, title, price, userId } = data;
    const profile = await User.findById(userId);

    if (!profile) throw new Error('not found'); // FIX!!!!!!!!!!!!

    const cartItem = {
      product: {id, title, price}
    };

    //@ts-ignore
    let cartItems = profile.cart;

    //@ts-ignore
    if(cartItems.length > 0){
      //@ts-ignore
      let isExist = false;
      //@ts-ignore
      cartItems.map(item => {
        //@ts-ignore
        if(item.product.id.toString() === id.toString()){
          //@ts-ignore
          if(isRemove){
            //@ts-ignore
            cartItems.splice(cartItems.indexOf(item), 1);
          }
          //@ts-ignore
          isExist = true;
        }
      });
//@ts-ignore
      if(!isExist){
        //@ts-ignore
        cartItems.push(cartItem);
      }
    }else{
      //@ts-ignore
      cartItems.push(cartItem);
    }
//@ts-ignore
    profile.cart = cartItems;
//@ts-ignore
    const cartSaveResult = await profile.save();

    msg.ack();
  }
}