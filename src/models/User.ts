import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the user schema
const userSchema = new Schema(
  {
    phonenumber: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Define the user document interface
interface UserDoc extends Document {
  phonenumber: string;
}

// Define the user model
const UserModel: Model<UserDoc> = mongoose.model<UserDoc>('User', userSchema);

// Export the model
export default UserModel;
