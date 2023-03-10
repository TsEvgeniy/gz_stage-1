import {ProductRemoveFromWishlistEvent, Publisher, Subjects} from "@good_zone/common";

export class ProductRemoveFromWishlistPublisher extends Publisher<ProductRemoveFromWishlistEvent> {
  subject: Subjects.ProductRemoveFromWishlist = Subjects.ProductRemoveFromWishlist;
}