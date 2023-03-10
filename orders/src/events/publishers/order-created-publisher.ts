import { Publisher, OrderCreatedEvent, Subjects } from "@good_zone/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
