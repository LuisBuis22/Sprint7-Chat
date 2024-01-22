import mongoose, { Document, Schema } from "mongoose";

interface InfoMessage {
  text: string;
  timestamp: Date;
}

interface InfoUser extends Document {
  name: string;
  messages: InfoMessage[];
}

const messageSchema = new Schema<InfoMessage>({
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const userSchema = new Schema<InfoUser>({
  name: { type: String, required: true },
  messages: [messageSchema],
});

const UserModel = mongoose.model<InfoUser>("User", userSchema);

export { UserModel, InfoMessage, InfoUser };