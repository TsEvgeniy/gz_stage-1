import {ProductRemoveFromCartEvent, Publisher, Subjects} from "@good_zone/common";

export class ProductRemoveFromCartPublisher extends Publisher<ProductRemoveFromCartEvent> {
  subject: Subjects.ProductRemoveFromCart = Subjects.ProductRemoveFromCart;
}