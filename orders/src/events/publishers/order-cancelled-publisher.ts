import { Subjects, Publisher, OrderCancelledEvent } from "@good_zone/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
