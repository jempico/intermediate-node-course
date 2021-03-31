/*const mongoose = require('mongoose');
const Hobby = require('./Hobby');

//Defining Schema for User Model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hobbies: [{ type: Schema.Types.ObjectId, ref:'Hobby'}]
});

//Exporting User model based on UserSchema
module.exports= mongoose.model('User',UserSchema)
*/