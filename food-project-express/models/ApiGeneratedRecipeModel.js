const mongoose = require('mongoose');


// ApiGeneratedRecipe Schema
const apiGeneratedRecipeSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    url: {type: String, unique: true},
    foodName: String,
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    },
  {
    timestamps: true
  });



const ApiGeneratedRecipe = mongoose.model('ApiGeneratedRecipe', apiGeneratedRecipeSchema);
module.exports = ApiGeneratedRecipe;
