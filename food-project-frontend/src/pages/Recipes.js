import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import RecipeCard from "../components/RecipeCard";
import './Recipes.css'
import { useAuth } from "../Context/Context";
import FilterPopUp from "../components/filterPopUp";
import RecipeForm from "../components/RecipeForm";
import UserRecipeCard from "../components/UserRecipeCard";
import SkeletonRecipeCard from "../components/SkelitonCard";

const RecipeList = () => {
  const { foodName } = useParams();
  const { edmam_ID, edmam_KEY, filterPopOn, RecipeFormOn } = useAuth();
  const {Recipes, setRecipes, userRecipes, setUserRecipes} = useAuth();
  const apiUrl = `https://api.edamam.com/search?q=${foodName}&app_id=${edmam_ID}&app_key=${edmam_KEY}`;
  const [userCardLoading, setUserCardLoading] = useState(true);

  function calorie(digest) {
    return digest.map(nutri => `${nutri.label}: ${nutri.total.toFixed(2)}${nutri.unit}`).join(', ');
  }



  useEffect(() => {
      const addApiRecipes = async () => {
        const urls = await Recipes.map(item => item.recipe.url);
        console.log(urls, foodName)
        try {
          const response = await axios.post(`http://localhost:8080/add-api-recipe`, {
            foodName: foodName,
            urls: urls,
          });

          return response.data;
        } catch (error) {
          if (error.response && error.response.status === 400 && error.response.data.error.includes('Recipe with the same foodName already exists')) {
            console.log(`Recipe with the foodName "${foodName}" already exists. Stopping further processing...`);
            return; // Stop further processing
          } else {
            throw new Error(error.response.data.error || 'Something went wrong');
          }
        }
    };
    addApiRecipes();
  }, [Recipes])


  useEffect(() => {
    if(filterPopOn || RecipeFormOn){
      document.getElementsByClassName("twelve")[0].style.opacity = "0.1";
    }else{
      document.getElementsByClassName("twelve")[0].style.opacity = "1";
    }
  }, [filterPopOn, RecipeFormOn])

  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const response = await axios.post("http://localhost:8080/fetch-user-recipe", {
          foodName: foodName
        });
        await setUserRecipes(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching user recipes:', error);
      }
    };
    fetchUserRecipes();
  }, [Recipes]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(apiUrl);
        await setRecipes(response.data.hits);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
  };
    fetchRecipes();
  }, [foodName, edmam_ID, edmam_ID]);

  useEffect(() => {
    // Simulate an API call with setTimeout
    setTimeout(() => {
      // Once the data is loaded, set loading to false
      setUserCardLoading(false);
      // Set your user recipes data here
    }, 10000); // Simulating a 2-second delay
  }, []);



  //styles
  const headingStyle = {
  fontSize: '80px',
  fontWeight: '600',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  width: '160px',
  textAlign: 'center',
  margin: 'auto',
  paddingBottom: '14px',
  whiteSpace: 'nowrap',
  position: 'relative',
  backgroundColor: "hsl(var(--hue), 95%, 84%"
  };

  const lineStyle = {
    backgroundColor: '#c50000',
    content: '',
    display: 'block',
    height: '6px',
    width: '160px',
    marginBottom: '0',
  };

  const lineAfterStyle = {
    backgroundColor: '#c50000',
    content: '',
    display: 'block',
    position: 'absolute',
    right: '-160px',
    bottom: '0',
    height: '6px',
    width: '160px',
    marginTop: '0.2em',
  };



  return (
    <div style={{backgroundColor: 'hsl(var(--hue), 95%, 84%'}} className="Recipe-Page">
      <FilterPopUp />
      <RecipeForm />
      <div style={{
        paddingTop: "40px",
        paddingBottom: "40px",
      }} className="twelve">
        <h1 style={headingStyle}>
          <span style={lineStyle}/>
          Recipes
          <span style={lineAfterStyle}/>
        </h1>
      </div>

      <div style={{ overflowX: 'auto', display:"block", paddingTop:"100px" }}>
        <h2 style={{
          display:"sticky",
          position: "absolute",
          left:"45%",
          top:"27%",
          fontSize:"40px",
          color: "cornsilk",
          letterSpacing:"1px",
          transform:"uppercase"
        }}>User Recipes</h2>
        <div style={{ whiteSpace: 'nowrap', display:"inline-flex",
          flexDirection: "row-reverse",
        }}>
          {(Recipes.length > 0 && userRecipes.length > 0) || !userCardLoading ? (
            userRecipes.length>0 ? (
            userRecipes.map((recipe, index) => (
            <UserRecipeCard
              key={index}
              id={recipe.recipeId}
              picture={recipe.picture}
              userName={recipe.username?recipe.username:recipe.userId}
              foodName={recipe.foodName}
              title={recipe.title}
              image={recipe.image}
              description={recipe.description}
              ingredients={recipe.ingredients}
              staticId={recipe.staticId}
            />
          ))
            ):(
                <div style={{alignSelf: "center", marginLeft:"19ch", textTransform:"uppercase",
                  fontSize:"40px"
                }}>
                  be the first one to add Recipe!
                </div>
          )
              ) : (
              Array.from({ length: 3 }).map((_, index) => <SkeletonRecipeCard key={index} />)
          )}
        </div>
      </div>

        <div style={{ margin: '64px auto', width: '1000px', maxWidth: '100%', position: 'relative' }}>
      <div style={{ overflow: 'hidden', height: '40px' }} className="astrodividermask">
        <div style={{
          content: ' ',
          display: 'block',
          margin: '-25px auto 0',
          width: '100%',
          height: '25px',
          borderRadius: '125px / 12px',
          boxShadow: '0 0 10px #1c596b'
        }}/>
      </div>
      <span style={{
        width: '50px',
        height: '50px',
        position: 'absolute',
        bottom: '60%',
        right:"45%",
        margin: '-25px 0 0 -25px',
        borderRadius: '100%',
        boxShadow: '0 2px 4px #1c596b',
        background: '#fff'
      }}>
        <i style={{
          position: 'absolute',
          top: '4px',
          bottom: '4px',
          left: '4px',
          right: '4px',
          borderRadius: '100%',
          border: '1px dashed #68beaa',
          textAlign: 'center',
          lineHeight: '40px',
          fontStyle: 'normal',
          color: 'goldenrod'
        }}>&#9733;</i>
      </span>
    </div>

      <h2 style={{
          display:"sticky",
          position: "relative",
          left:"45%",
          top:"135%",
          fontSize:"40px",
          color: "cornsilk",
          letterSpacing:"1px",
          transform:"uppercase",
        }}>Api Recipes</h2>



      {Recipes.length > 0 ? (
      Recipes.map((recipe, index)=>(
        <RecipeCard
          key={index}
          title={recipe.recipe.label}
          description={`calories: ${recipe.recipe.calories.toFixed(2)}, ${calorie(recipe.recipe.digest)}`}
          imageSrc={recipe.recipe.image}
          ingredients={recipe.recipe.ingredientLines}
          recipe={recipe.recipe.url}
          yield={recipe.recipe.yield}
        />
      ))
    ) : (
      <p>Loading...</p>
    )}
    </div>
  );
};

export default RecipeList;
