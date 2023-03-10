import {ProductAddToCartEvent, Publisher, Subjects} from "@good_zone/common";

export class ProductAddToCartPublisher extends Publisher<ProductAddToCartEvent> {
  subject: Subjects.ProductAddToCart = Subjects.ProductAddToCart;
}