import { Publisher, Subjects, ProductUpdatedEvent } from '@good_zone/common';

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
    subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
}