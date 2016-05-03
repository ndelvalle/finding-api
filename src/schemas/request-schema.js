import mongoose from 'mongoose';
import ContactSchema from './contact-schema';

const Schema = mongoose.Schema;

const RequestSchema = new Schema({

  name: {
    type: String,
    required: true,
    unique: true,
  },

  contact: ContactSchema,

});

export default mongoose.model('Request', RequestSchema);
