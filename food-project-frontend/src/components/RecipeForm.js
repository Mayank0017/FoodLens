import React, { useState, useEffect } from 'react';
import {useAuth} from "../Context/Context";
import './RecipeForm.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAdd} from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import {useParams} from "react-router-dom";

const RecipeForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [recipeImage, setRecipeImage] = useState('');
  const [recipePicture, setRecipePicture] = useState('');
  const { setRecipeFormOn, RecipeFormOn, user, userRecipes, setUserRecipes } = useAuth();
  const [resetForm, setResetForm] = useState(false);
  const { foodName } = useParams();

  const addUserRecipes = async (foodName, title, image, description, ingredients, instructions) => {
      try {
        const newRecipe = {
          userId: user._id,
          foodName: foodName,
          title: title,
          image: image,
          description: description,
          ingredients: ingredients,
          instructions: instructions
        };
        const response = await axios.post('/add-user-recipe', newRecipe);
        //for static use
        const newRecipeADD = {
          userId: user.name,
          foodName: foodName,
          title: title,
          image: image,
          picture: user.picture,
          description: description,
          ingredients: ingredients,
          instructions: instructions,
          staticId: response.data.id
        };
        setUserRecipes([...userRecipes, newRecipeADD]);
        console.log(response.data); // Log the response from the server
      } catch (error) {
        console.error(error);
      }
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const handleAddInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      setRecipeImage(base64String);
    }

    await reader.readAsDataURL(file);
  };


  const handleInputChange = (index, type, value) => {
    if (type === 'ingredient') {
      const newIngredients = [...ingredients];
      newIngredients[index] = value;
      setIngredients(newIngredients);
    } else if (type === 'instruction') {
      const newInstructions = [...instructions];
      newInstructions[index] = value;
      setInstructions(newInstructions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your form submission logic here
    handleClose();
    await addUserRecipes(foodName, title, recipeImage, description, ingredients, instructions);
  };
  const handleClose = ()=>{
    setRecipeFormOn(false);
  }

  useEffect(() => {
      if(!RecipeFormOn){
          document.getElementsByClassName("RecipeForm-container")[0].style.display = "none";
      }else{
          setResetForm(true);
          document.getElementsByClassName("RecipeForm-container")[0].style.display = "block";
      }
  }, [RecipeFormOn])

  useEffect(() => {
    if (resetForm) {
      setTitle('');
      setDescription('');
      setIngredients(['']);
      setInstructions(['']);
      setResetForm(false); // Reset resetForm to false after resetting the form
    }
  }, [resetForm]);

  return (
    <div className="RecipeForm-container">
      <button style={{fontSize:"40px",backgroundColor: "transparent",color: "darkslateblue", position:"absolute", left:"90%", top:"-20px", borderRadius:"10px"}} onClick={handleClose}>&times;</button>
      <h2 style={{marginTop:"40px", marginLeft:"32%", marginBottom:"40px"}}>
        <span style={{left:"20%", top:"70px"}} className="dot"/>
        <span style={{
          fontWeight:"bold",
          color: "darkslateblue"
        }}>Add Your Recipe</span>
        <span style={{right:"20%", top:"70px"}} className="dot"/>
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="RecipeForm-input-container">
          <label className="RecipeForm-label">Title:</label>
          <input
            type="text"
            className="RecipeForm-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="RecipeForm-input-container">
          <label className="RecipeForm-label">Description:</label>
          <textarea
            className="RecipeForm-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="RecipeForm-input-container">
          <label className="RecipeForm-label">Ingredients:</label>
          {ingredients.map((ingredient, index) => (
            <div key={index}>
              <input
                type="text"
                className="RecipeForm-input"
                value={ingredient}
                onChange={(e) => handleInputChange(index, 'ingredient', e.target.value)}
                required
              />
              {index === ingredients.length - 1 && (
                <button type="button" className="RecipeForm-add-input-button" onClick={handleAddIngredient}>
                  <FontAwesomeIcon icon={faAdd} />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="RecipeForm-input-container">
          <label className="RecipeForm-label">Instructions:</label>
          {instructions.map((instruction, index) => (
            <div key={index}>
              <textarea
                className="RecipeForm-textarea"
                value={instruction}
                onChange={(e) => handleInputChange(index, 'instruction', e.target.value)}
                required
              />
              {index === instructions.length - 1 && (
                <button type="button" className="RecipeForm-add-input-button" onClick={handleAddInstruction}>
                  <FontAwesomeIcon icon={faAdd} />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="RecipeForm-input-container">
        <label
          className="RecipeForm-upload-button"
          style={{
            position:"relative",
            display: 'inline-block',
            padding: '10px 20px',
            border: '2px solid #ccc',
            borderRadius: '10px',
            cursor: 'pointer',
            backgroundColor: '#f9f9f9',
            margin: "10px",
            marginLeft: '-10px',
            opacity: "0.8",
          }}
        >
          Upload Image
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
            required
          />
        </label>
      </div>


        <button type="submit" className="RecipeForm-button">
          Submit Recipe
        </button>
      </form>
    </div>
  );
};

export default RecipeForm;
