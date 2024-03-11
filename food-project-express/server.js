const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const User = require('./models/userModel');
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const {protect} = require("./middleware/authMiddleware");
const jwt = require('jsonwebtoken');
const e = require("express");
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const ApiGeneratedRecipe = require('./models/ApiGeneratedRecipeModel');
const UserGeneratedRecipe = require('./models/UserGeneratedRecipeModel');
const Comment = require('./models/CommentModel');



const app = express();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Define how the file will be named
  }
});

const upload = multer({ storage: storage });


// Use CORS middleware
app.use(cors({
  origin: ['http://localhost:3000', "http://localhost:8000"]
}));
app.use(express.json({limit: '10mb'}));

const connectDB = asyncHandler(async () => {
    try {
        await mongoose.connect("mongodb+srv://mayank02srivastava:Mayank%402002@cluster0.1cttebw.mongodb.net/");
        console.log("database successfully connected");
    } catch (e) {
        console.log(e)
        }
    }
);
connectDB();






app.get("/", asyncHandler(async (req, res)=>{
    res.json({
        "body": "hello"
    })
}));

app.post('/Signup', asyncHandler(async (req, res) => {
  const { name, email, password, profilePicture } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      picture: profilePicture ? profilePicture : undefined,
    });
    await newUser.save();
    const token = jwt.sign({id: newUser._id}, 'spiderman', { expiresIn: '1d' });

    res.status(200).json({
            token: token,
        });
    console.log("registered")
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}));


app.post('/Login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(user){
    if(user.matchPassword(password)) {
        console.log("logged in");
        // noinspection JSCheckFunctionSignatures
        res.status(200).json({
            token: jwt.sign({id: user._id }, 'spiderman', { expiresIn: '1d' })
        });
    }else {
        res.status(401);
        throw new Error("Invalid password");
    }
    } else {
        res.status(401);
        throw new Error("Invalid id or password");
    }
}));


app.post('/verify-token',  asyncHandler(async (req, res) => {
  const { token } = req.body;

  jwt.verify(token, "spiderman", async (err, decoded) => {
      if (err) {
          return res.status(401).json({message: 'Invalid token'});
      }

      const user_id = decoded.id;
      const user = await User.findOne({_id: user_id}); // Corrected query

      if (!user) {
          console.log("User not found");
          return res.status(401).json({message: 'User not found'});
      }
      // Respond with user information
      res.status(200).json(user);
  });
}));

app.post('/image', asyncHandler(async (req, res) => {
  try {
    const base64File = await req.body.base64File;
    const fileContent = Buffer.from(base64File, 'base64');
    const formData = new FormData();
    formData.append('file', fileContent, { filename: 'uploaded-image.png' });

    const response = await axios.post('http://localhost:8000/predict', formData, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      }
    });

    const responseData = response.data;

    res.status(200).send(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}));



app.post('/add-api-recipe', asyncHandler(async (req, res) => {
  try {
    const { foodName, urls } = req.body;

    const existingRecipe = await ApiGeneratedRecipe.findOne({ foodName: { $regex: new RegExp(foodName, "i") } });

    if (existingRecipe) {
      return res.status(400).json({ error: 'Recipe with the same foodName already exists' });
    }

    for (const url of urls) {
      const newRecipe = new ApiGeneratedRecipe({
        foodName: foodName,
        url: url
      });
      await newRecipe.save();
    }

    res.status(200).json({ message: 'Api-generated recipes added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}));



app.post('/add-user-recipe', asyncHandler(async (req, res) => {
  try {
    const { userId, foodName, title, image, description, ingredients, instructions } = req.body;
    const newUserRecipe = new UserGeneratedRecipe({
      user: userId, // Associate the recipe with the user
      foodName: foodName,
      title: title,
      image: image,
      description: description,
      ingredients: ingredients,
      instructions: instructions,
    });

    const savedRecipe = await newUserRecipe.save();
    const newRecipeId = savedRecipe._id;
    res.status(200).json({ message: 'User-generated recipe added successfully', id: newRecipeId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}));


app.post('/fetch-user-recipe', asyncHandler(async (req, res) => {
  try {
    const { foodName } = req.body;
    const userRecipes = await UserGeneratedRecipe.find({
      foodName: { $regex: new RegExp(foodName, 'i') }
    });
    const recipeList = userRecipes.map(recipe => ({
      recipeId: recipe._id,
      foodName: recipe.foodName,
      username: recipe.user ? (recipe.user.name):(''),
      picture: recipe.user ? (recipe.user.picture):(''),
      title: recipe.title,
      image: recipe.image,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions
    }));
    res.json(recipeList);
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}));

app.post("/add-comment", asyncHandler(async (req, res) => {
  try {
    const { url, user, text } = req.body;

    if (url) {
      // If URI is provided, find the corresponding API generated recipe
      const apiRecipe = await ApiGeneratedRecipe.findOne({ url });

      if (!apiRecipe) {
        return res.status(404).json({ error: "API generated recipe not found" });
      }

      // Create a new comment
      const response = await axios.post('http://localhost:8000/predict_sentiment/', null, {
      params: {
          text: text
      },
      headers: {
          'accept': 'application/json',
          'Content-Type': 'multipart/form-data', // Set the appropriate content type
      }
      });
      const sentiment = response.data.sentiment;
      const comment = new Comment({
        text,
        sentiment,
        user,
      });

      // Save the comment
      await comment.save();

      // Append the comment to the API generated recipe's comments array
      apiRecipe.comments.push(comment);
      await apiRecipe.save();

      res.json({ message: "Comment added successfully", sentiment: sentiment});
    } else {
      // If URI is not provided, assume it's a user generated recipe (based on the context)
      const { recipeId, user, text } = req.body; // Assuming you have a way to get the recipe ID

      // Find the user generated recipe by ID
      const userRecipe = await UserGeneratedRecipe.findById(recipeId);

      if (!userRecipe) {
        return res.status(404).json({ error: "User generated recipe not found" });
      }
      // Create a new comment
      const response = await axios.post('http://localhost:8000/predict_sentiment/', null, {
      params: {
          text: text
      },
      headers: {
          'accept': 'application/json',
          'Content-Type': 'multipart/form-data', // Set the appropriate content type
      }
      });
      const sentiment = response.data.sentiment;
      const comment = new Comment({
        text,
        sentiment,
        user,
      });

      // Save the comment
      await comment.save();

      // Append the comment to the user generated recipe's comments array
      userRecipe.comments.push(comment);
      await userRecipe.save();

      res.json({ message: "Comment added successfully", sentiment: sentiment });
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}));

app.post('/fetch-comments', async (req, res) => {
  try {
    const { url, recipeId } = req.body;

    if (url) {
      // Fetch comments for API generated recipe
      const apiRecipe = await ApiGeneratedRecipe.findOne({ url: url });
      if (!apiRecipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      const comments = await Comment.find({ _id: { $in: apiRecipe.comments } })
        .populate('user', 'name picture');

      const countPos = await comments.filter(comment => comment.sentiment === "positive").length;
      const countTot = await comments.filter(comment => comment.sentiment === "positive" || comment.sentiment !== "positive").length;

      const commentsData = comments.map(comment => ({
        text: comment.text,
        username: comment.user.name ? comment.user.name : "noname",
        picture: comment.user.picture,
        countPos: countPos,
        countTot: countTot,
        sentiment: comment.sentiment
      }));

      return res.json(commentsData);
    } else if (recipeId) {
      // Fetch comments for user generated recipe
      const userRecipe = await UserGeneratedRecipe.findById(recipeId);
      if (!userRecipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      const comments = await Comment.find({ _id: { $in: userRecipe.comments } })
        .populate('user', 'name picture');

      const countPos = comments.filter(comment => comment.sentiment === "positive").length;
      const countTot = await comments.filter(comment => comment.sentiment === "positive" || comment.sentiment !== "positive").length;

      const commentsData = comments.map(comment => ({
        text: comment.text,
        username: comment.user.name ? comment.user.name : "noname",
        picture: comment.user.picture,
        countPos: countPos,
        countTot: countTot,
        sentiment: comment.sentiment
      }));

      return res.json(commentsData);
    } else {
      return res.status(400).json({ error: 'Invalid request. Provide either URL or recipe ID.' });
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/user-recipe-by-id', async (req, res) => {
  try {
    const { recipeId } = req.body;

    const recipe = await UserGeneratedRecipe
      .findById(recipeId)
      .populate('user', 'name picture email');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});





app.listen(8080, () => {
  console.log(`http://localhost:8080`);
});


