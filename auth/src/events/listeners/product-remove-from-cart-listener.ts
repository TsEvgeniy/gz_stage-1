import {Listener, ProductRemoveFromCartEvent, Subjects} from "@good_zone/common";
import {queueGroupName} from "./queue-group-name";
import {Message} from "node-nats-streaming";
import {User} from "../../models/user";

export class ProductRemoveFromCartListener extends Listener<ProductRemoveFromCartEvent> {
  subject: Subjects.ProductRemoveFromCart = Subjects.ProductRemoveFromCart;
  queueGroupName = queueGroupName;

  async onMessage(data: ProductRemoveFromCartEvent["data"], msg: Message) {
    const isRemove = true;
    const { id, title, price, userId } = data;
    const profile = await User.findById(userId);

    if (!profile) throw new Error('not found'); // FIX!!!!!!!!!!!!

    const cartItem = {
      product: {id, title, price}
    };

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