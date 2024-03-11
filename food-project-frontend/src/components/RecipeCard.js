import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Collapse, InputGroup, FormControl } from 'react-bootstrap';
import {
  faStar,
  faLongArrowAltRight, faLongArrowAltDown, faArrowCircleUp, faPaperPlane, faStarHalf
} from '@fortawesome/free-solid-svg-icons';
import {useAuth} from "../Context/Context";
import axios from "axios";
import {useLocation, useParams} from "react-router-dom";

const RecipeCard = (props) => {
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isFlipped, setIsFlipped] = useState(true);
  const { filterPopOn, RecipeFormOn, user, Recipes } = useAuth();
  const {foodName} = useParams();
  let fiveStarRating;


  useEffect(() => {
    if(filterPopOn || RecipeFormOn){
      const elements = document.getElementsByClassName("border-radius");
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.opacity = "0.4";
      }
    }else{
      const elements = document.getElementsByClassName("border-radius");
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.opacity = "1";
      }
    }
  }, [filterPopOn, RecipeFormOn])


  useEffect(() => {
  const fetchComments = async () => {
    try {
      const response = await axios.post('/fetch-comments', {
        url: props.recipe, // Replace with the actual URL or recipe ID
      });
      await setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
    fetchComments();
  }, [Recipes]);

  const handleFlip = async () => {
    await setIsFlipped(!isFlipped);
  };

  const handleShowComments = () => {
    setCommentsVisible(!commentsVisible);
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleAddComment = () => {
    const User = user; // Assuming you have a function to get the user information
    const data = {
      url: props.recipe, // Replace with the actual URI
      text: newComment,
      user: User._id, // Assuming user.id is the unique identifier for the user
    };
    setNewComment('');

    axios.post('/add-comment', data)
      .then(response => {
        console.log(response.data.message);
        setComments([...comments, { text: newComment, username: User.name, picture:User.picture, sentiment: response.data.sentiment}]);
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
  function calorieTable(digest) {
    const nutrients = digest.split(', ');
    return (
      <table>
        <thead>
          <tr>
            <th style={{ color: '#351897', fontWeight: '400', fontSize:"25px" }}>Nutrients</th>
            <th style={{ color: '#351897', fontWeight: '400', fontSize:"25px" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {nutrients.map((nutrient, index) => {
            const [label, value] = nutrient.split(': ');
            return (
              <tr key={index}>
                <td style={{paddingRight:"80px"}}>{label}</td>
                <td>{value}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }


  const cardStyle = {
    width: '100%',
    padding: '100px',
    paddingTop: '10px',
    paddingLeft: '50px',
    paddingBottom: '80px',
    backgroundColor: 'hsl(var(--hue), 95%, 84%',
  };

  const backStyle = {
    display: isFlipped ? "none": "flex",
    width: "100%",
    paddingBottom: "50px",
  };
  const frontStyle = {
    display: isFlipped ? "flex": "none",
  };

  const containerStyle = {
    backgroundColor: 'transparent',
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: '280px 1000px',
    borderRadius: '20px',
    zIndex: 1,
  };

  const imageStyle = {
    width: '310px',
    height: '310px',
    borderRadius: '30px 30px 30px 30px',
    alignSelf: 'center',
    boxShadow: '0 15px 20px rgba(0, 0, 0, 0.356)',
    backgroundColor: 'transparent',
    zIndex: 1,
  };

  const buttonStyle = {
    position: 'absolute',
    bottom: '-35px',
    right: '10px',
    border: 'none',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fc9400',
    color: '#fff',
    padding: '22px 45px',
    fontSize: '1rem',
    textTransform: 'uppercase',
    borderRadius: '20px',
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.294)',
  };
  const buttonStyle2 = {
    position: 'absolute',
    bottom: '-35px',
    left: '50px',
    border: 'none',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fc9400',
    color: '#fff',
    padding: '22px 45px',
    fontSize: '1rem',
    textTransform: 'uppercase',
    borderRadius: '20px',
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.294)',
  };


  const textContainerStyle = {
    padding: '40px 40px 0',
    wordWrap: 'break-word',
    maxWidth: '500px',
  };

  const ingredientsListStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '10px',
    listStyleType: 'none',
    padding: '0',
    margin: '0',
  };

  const ingredientItemStyle = {
    marginBottom: '5px',
    fontSize: '1rem',
    fontWeight: '400',
    color: '#818189',
  };

  const ingredientQuantityStyle = {
    color: '#351897',
    fontWeight: 'bold',
    fontSize: '1.2rem',
  };

  return (
    <div style={cardStyle} className="border-radius">
      <div style={containerStyle}>
        <img
          src={props.imageSrc}
          alt={props.title}
          style={imageStyle}
        />
        <div style={{
          padding: '40px 40px 0', backgroundColor: 'rgba(255, 255, 255, 0.6)',
          borderRadius: '20px',
          boxShadow: '0 15px 20px rgba(0, 0, 0, 0.356)',
          zIndex: 0,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.8s',
          transform: isFlipped ? 'rotateY(360deg)' : 'rotateY(0deg)',
        }} className="textCard">
        <div style={frontStyle} onClick={handleFlip}>
          <div>
            <h1 style={{ color: '#351897', fontWeight: '400' }}>{props.title}</h1>
            <div style={{ fontSize: '1.2rem', color: '#ffa800', margin: '-5px 0 20px' }}>
              {[...Array(5)].map((_, index) => {
                if (index + 1 <= fiveStarRating) {
                  return <FontAwesomeIcon key={index} icon={faStar} className="fa fa-star checked" />;
                } else if (index + 0.5 === fiveStarRating) {
                  return <FontAwesomeIcon key={index} icon={faStarHalf} className="fa fa-star checked" />;
                } else {
                  return <FontAwesomeIcon key={index} icon={faStar} />;
                }
              })}
            </div>
            <p style={{ fontSize: '0.9rem' }}>{props.description}</p>
            <h1 style={{ color: '#351897', fontWeight: '350' }}>Ingredients</h1>
            <div style={{ display: 'flex', margin: '20px 0 10px' }}>
              <ul style={ingredientsListStyle}>
                {props.ingredients.map((item, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>
                    <h2 style={ingredientItemStyle}>{item}</h2>
                  </li>
                ))}
              </ul>
            </div>
             <div style={{ display: 'flex', margin: '20px 0 10px' }}>
              <div>
                <h2 style={{ marginBottom: '5px', fontSize: '1rem', fontWeight: '400', color: '#818189' }}>Yield</h2>
                <p style={{ color: '#351897', fontWeight: 'bold', fontSize: '1.2rem' }}>{props.yield}</p>
              </div>
             </div>
          </div>
        </div>
        <div style={backStyle} onClick={handleFlip}>
          <div>
          {calorieTable(props.description)}
        </div>
        </div>
          <button style={buttonStyle}  onClick={() => window.location.href = props.recipe}>
              View Recipe <FontAwesomeIcon style={{marginLeft: '15px'}} icon={faLongArrowAltRight} className="fa fa-arrow-right"/>
            </button>
            <button style={buttonStyle2}  onClick={handleShowComments}>
              Show Comments <FontAwesomeIcon style={{marginLeft: '15px'}} icon={faLongArrowAltDown} className="fa fa-arrow-right"/>
            </button>
            {/* Comments Section */}
          <Collapse in={commentsVisible}>
            <div style={{marginBottom:"40px"}} className="recipe-card__comments">
              {/* Add Comment Input */}
              <InputGroup className="mb-3">
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

              {/* Render Comments */}
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
      </div>
    </div>
  );
};

export default RecipeCard;
