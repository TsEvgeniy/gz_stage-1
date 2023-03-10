import {ProductAddToWishlistEvent, Publisher, Subjects} from "@good_zone/common";

export class ProductAddToWishlistPublisher extends Publisher<ProductAddToWishlistEvent> {
  subject: Subjects.ProductAddToWishlist = Subjects.ProductAddToWishlist;
}