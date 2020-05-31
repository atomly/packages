// Libraries
import { model, Schema } from 'mongoose';

// Types
import { ISubscriber } from './types';

const subscribersSchema = new Schema<ISubscriber>({
  email:  {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/i, 'Invalid email pattern'],
    minlength: 1,
  },
  fullName: {
    type: String,
    required: true,
    minlength: 1,
  },
  reference: {
    type: String,
    required: true,
    minlength: 1,
  },
});

export default model<ISubscriber>('Subscriber', subscribersSchema, 'subscriber');
