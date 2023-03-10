import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@good_zone/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
