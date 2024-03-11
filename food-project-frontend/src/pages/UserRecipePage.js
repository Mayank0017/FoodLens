import React, { useEffect, useState } from 'react';
import {useParams} from "react-router-dom";
import axios from "axios";
import {Button, Collapse, FormControl, InputGroup} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRight, faLongArrowAltDown, faLongArrowAltRight, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {useAuth} from "../Context/Context";
import './UserRecipePage.css'

const UserRecipePage = ({ match }) => {
  const [commentsVisible, setCommentsVisible] = useState(false);
   const { user, edmam_ID, edmam_KEY } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const { RecipeId } = useParams();
  const recipeId = RecipeId;

  const [recipeData, setRecipeData] = useState(null); // State to hold the fetched recipe data
  const [type, setType] = useState(null);


  const handleShowComments = () => {
    setCommentsVisible(!commentsVisible);
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };
  const handleAddComment = () => {
    const User = user;
    const newCommentObj = {
      text: newComment,
      username: User.name,
      picture: User.picture,
    };
    setComments([...comments, newCommentObj]);
    const data = {
      recipeId: recipeId, // Replace with the actual URI
      text: newComment,
      user: User._id, // Assuming user.id is the unique identifier for the user
    };
    setNewComment('');

    axios.post('/add-comment', data)
      .then(response => {
        console.log(response.data.sentiment);
        const newCommentObj = {
          text: newComment,
          username: User.name,
          picture: User.picture,
          sentiment: response.data.sentiment
        };
        setComments([...comments, newCommentObj]);
      })
      .catch(error => {
        console.error('Error adding comment:', error);
      });
  };
  const handleCommentKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && e.target.value.length>0) {
      e.preventDefault();
      handleAddComment();
    }
  };

  useEffect(() => {
    const handleFetchRecipe = async () => {
      try {
        const response = await axios.post('/user-recipe-by-id', { recipeId });
        setRecipeData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchComments = async () => {
    try {
      const response = await axios.post('/fetch-comments', {
        recipeId: recipeId,
      });
      await setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
    fetchComments();
    handleFetchRecipe();


  }, [recipeId]);


   const buttonStyle2 = {
    position: 'absolute',
    bottom: '-35px',
    left: '50px',
    border: 'none',
    outline: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#fc9400',
    color: '#fff',
    padding: '22px 45px',
    fontSize: '1rem',
    textTransform: 'uppercase',
    borderRadius: '20px',
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.294)',
    zIndex: 2
  };

   const buttonStyle = {
    position: 'relative',
    width: '90px',
    height: '90px',
    borderRadius: '65px',
    border: '1px solid #23a6d5'
  };


  return (
    <div className="BackBody">

      {recipeData ? (
        <div className="UserRecipePagebody">
          <div className="headerBody" >
              <div>
                  <img src={recipeData.user.picture.includes("http") ? recipeData.user.picture:`data:image/jpeg;base64,${recipeData.user.picture}`} style={buttonStyle}/>
                  <h1 className="name">{recipeData.user.name}</h1>
              </div>
              <h1 className="RecipeTitle">{recipeData.title}</h1>
              <div className="speciality">
                  {type}
              </div>
          </div>
          <div className="middleBody">
              <div className="ingrediantsList">

              </div>
              <div className="RecipeImage">

              </div>
          </div>
          <p style={{
          fontSize: '18px',
          fontStyle: 'italic',
          borderLeft: '4px solid #ffcc00',
          paddingLeft: '12px',
          lineHeight: '1.5',
          marginTop: '20px',
          marginBottom: '20px'
        }}>{recipeData.description}</p>
            <div style={{ margin: "5%", display: 'flex', alignItems: 'center', backgroundColor:"#eae9e9", paddingBottom: "4%" }}>
                <img
                  src={`data:image/png;base64, ${recipeData.image}`}
                  alt="Recipe"
                  style={{
                    width: "auto",
                    borderRadius: '8px',
                    boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
                    minWidth: '35%', // Adjust based on your image size preference
                    marginLeft: "5%",
                  }}
                />
                <div style={{ paddingLeft: '14%' }}>
                    <h2 style={{ fontSize: '24px', marginBottom: '12px', fontWeight: 'bold' }}>Ingredients</h2>
                <ul style={{ listStyle: 'none', fontFamily: 'Arial', fontSize: '16px' }}>
                  {recipeData.ingredients.map((ingredient, index) => (
                    <li
                      key={index}
                      style={{
                        marginBottom: '8px',
                        paddingLeft: '12px',
                        position: 'relative',
                        color: '#555',
                          wordBreak: 'break-word',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          left: '-12px',
                          top: '4px',
                          borderRadius: '50%',
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#ffcc00', // Change the bullet color here
                        }}
                      />
                      {ingredient}
                    </li>
                  ))}
                </ul>
                <h2 style={{ fontSize: '24px', marginBottom: '12px', fontWeight: 'bold' }}>Recipe</h2>
                    <ul style={{ listStyle: 'none', fontFamily: 'Arial', fontSize: '16px' }}>
                  {recipeData.instructions.map((instuction, index) => (
                    <li
                      key={index}
                      style={{
                        marginBottom: '8px',
                        paddingLeft: '12px',
                        position: 'relative',
                        color: '#555',
                        wordBreak: 'break-word',
                      }}
                    >
                      <span
                          style={{
                            position: 'absolute',
                            left: '-15px',
                            top: '1px',
                            width: '0',
                            height: '0',
                          }}
                      >
                          <FontAwesomeIcon icon={faArrowRight}/>
                      </span>
                      {instuction}
                    </li>
                  ))}
                </ul>
                </div>
            </div>
            <button style={buttonStyle2}  onClick={handleShowComments}>
              Show Comments <FontAwesomeIcon style={{marginLeft: '15px'}} icon={faLongArrowAltDown} className="fa fa-arrow-right"/>
            </button>
          <Collapse in={commentsVisible}>
            <div style={{margin: "30px",marginBottom:"40px"}} className="recipe-card__comments">
              {/* Add Comment Input */}
              <InputGroup className="mb-3" style={{zIndex: "2", paddingBottom:"40px"}}>
                <FormControl
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={handleCommentChange}
                  onKeyDown={handleCommentKeyPress}
                />
                <Button style={{display: "contents", fontSize: "30px"}} variant="outline-secondary" onClick={handleAddComment}>
                  <FontAwesomeIcon icon={faPaperPlane} />
                </Button>
              </InputGroup>

              <div style={{overflowY:"auto", maxHeight:"250px", display:"flex", flexDirection:"column-reverse"}}>
              {comments.map((comment, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <div style={{display:"flex", flexDirection:"column"}}>
                  <img
                    src={!comment.picture.includes("http") ? (`data:image/jpeg;base64,${comment.picture}`):(comment.picture)}
                    alt="Profile"
                    style={{ width: "40px", height: "40px", borderRadius: "50%" , display:"flex", alignSelf:"center", left:"2%"}}
                  />
                  <span style={{
                    color: '#351897',
                    fontWeight:"500",
                    position:"relative",
                    display: "flex",
                    alignSelf: "center"
                  }}>{comment.username}</span>
                    </div>
                  <div style={{backgroundColor:
                    comment.sentiment === 'positive'
                      ? '#b5e3ac'
                      : comment.sentiment === 'negative'
                      ? '#e07e7e'
                      : 'powderblue', width:"85%", left:"5%", bottom:"2%"}} className="alert alert-secondary" role="alert">
                    {comment.text}
                  </div>
                </div>
              ))}
            </div>
            </div>
          </Collapse>
          </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default UserRecipePage;
