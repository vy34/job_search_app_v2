const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
   username: { type: String, required: true, unique: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   location: { type: String, required: false },
   phone: { type: String, required: false },
   updated: { type: Boolean, default: false },
   isAdmin: { type: Boolean, default: false },
   isAgent: { type: Boolean, default: false },
   skills: { type: Boolean, required: false },
   profile: { type: String, required: false ,default: "" }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);