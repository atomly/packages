import { Document } from "mongoose";

export interface ISubscriber extends Document {
  email: string
  fullName: string
  reference: string
}
