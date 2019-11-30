const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  rollno: {
    type: Number,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
});

mongoose.model('Student', studentSchema);