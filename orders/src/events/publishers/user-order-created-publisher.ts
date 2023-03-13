import { Publisher, UserOrderCreatedEvent, Subjects } from '@good_zone/common';

export class UserOrderCreatedPublisher extends Publisher<UserOrderCreatedEvent> {
    subject: Subjects.UserOrderCreated = Subjects.UserOrderCreated;
}