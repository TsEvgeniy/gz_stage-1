import {ProductCreatedEvent, Publisher, Subjects} from "@good_zone/common";

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  subject: Subjects.ProductCreated = Subjects.ProductCreated;
}