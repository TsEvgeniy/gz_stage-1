import { Message } from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects } from '@good_zone/common';
import { queueGroupName } from './queue-group-name';
import { User } from '../../models/user';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id, status, product, userId, version } = data;
    const profile = await User.findById(userId);

    console.log('*********MESSAGE_AUTH_BROKER*********', data);

    if (!profile) throw new Error('not found!'); // FIX THIS PART!

    const order = { id, status, product, version };

    //@ts-ignore
    profile.orders.push(order);

    await profile.save();

    msg.ack();
  }
}
