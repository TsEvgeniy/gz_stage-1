import { Listener, UserOrderCreatedEvent, Subjects } from '@good_zone/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { User } from "../../models/user";

export class UserOrderCreatedListener extends Listener<UserOrderCreatedEvent> {
    subject: Subjects.UserOrderCreated = Subjects.UserOrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: UserOrderCreatedEvent["data"], msg: Message) {
        const { id, status, product, userId } = data;
        const profile = await User.findById(userId);

        if (!profile) throw new Error('not found!'); // FIX THIS PART!

        const order = {id, status, product};

        //@ts-ignore
        profile.orders.push(order);

        await profile.save();

        msg.ack();
    }
}