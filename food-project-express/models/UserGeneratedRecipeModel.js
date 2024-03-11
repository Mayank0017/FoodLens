const mongoose = require('mongoose');


// UserGeneratedRecipe Schema
const userGeneratedRecipeSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  foodName: String,
  title: String,
  image: String,
  description: String,
  ingredients: [String],
  instructions: [String],
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}], // Array of comments
},
    {
    timestamps: true
  }
);

// Populate the 'user' field with the associated user's data
userGeneratedRecipeSchema
  .pre('findOne', autoPopulateUser)
  .pre('find', autoPopulateUser);

function autoPopulateUser(next) {
  this.populate('user', 'name picture email'); // Populate 'user' field with 'name' only
  next();
}

const UserGeneratedRecipe = mongoose.model('UserGeneratedRecipe', userGeneratedRecipeSchema);
module.exports = UserGeneratedRecipe;