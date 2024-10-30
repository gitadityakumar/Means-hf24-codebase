import mongoose, { Schema, Document } from 'mongoose';

interface IInitialData extends Document {
  word: string;
  meaning: string;
}

const initialDataSchema: Schema = new Schema({
  word: {
    type: String,
    required: true
  },
  meaning: {
    type: String,
    required: true
  }
});

const InitialData = mongoose.model<IInitialData>('InitialData', initialDataSchema);
export default InitialData;
