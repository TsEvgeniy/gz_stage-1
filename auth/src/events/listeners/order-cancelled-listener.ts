import {
  OrderCancelledEvent,
  Subjects,
  Listener,
  OrderStatus,
} from '@good_zone/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { User } from '../../models/user';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    console.log('*** CANCELLED ORDER MESSAGE BROKER AUTH SERVICE ***');
    console.log(data);

    const user = await User.findById({ _id: data.userId });

    console.log('*** USER ***', user);
    //@ts-ignore
    console.log('>>>>>>>>>>>>>>>>>>> USERS ORDERS: ', user.orders);

    msg.ack();
  }
}
