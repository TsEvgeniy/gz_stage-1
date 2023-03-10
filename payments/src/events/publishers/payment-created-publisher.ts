import { Subjects, Publisher, PaymentCreatedEvent } from "@good_zone/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
