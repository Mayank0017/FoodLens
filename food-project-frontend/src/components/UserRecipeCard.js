import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFire, faLongArrowAltRight} from '@fortawesome/free-solid-svg-icons';
import {Link, useLocation, useNavigate} from "react-router-dom";


const UserRecipeCard = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { foodName, id, userName, title, image, description, ingredients, picture, staticId } = props;

  const readmore = () => {
    navigate(location.pathname+'/'+(id===undefined?staticId:id))
  }

  const cardStyle = {
    position:"relative",
    display: "flex",
    flexDirection:"column",
    background: '#fff',
    marginBottom: '4em',
    marginLeft: '2em',
    marginRight: '2em',
    width: '400px',
    height: "auto",
    maxHeight: "600px",
    borderRadius: "25px",
    backgroundColor: 'rgb(276, 276, 276, 0.8)',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.294)',
  };

  const asideStyle = {
    position: 'relative',
  };

  const imageStyle = {
    width:"400px",
    height:"250px",
    verticalAlign: 'bottom',
    borderRadius: "25px",
    borderBottomLeftRadius: "0",
    borderBottomRightRadius: "0",

  };
  const logo = {
    display: "inline-flex",
    flexDirection: "column",
    position: "absolute",
    top: '80%',
    right: '2%',
  }

  const buttonStyle = {
    display: 'inline-block',
    position: 'relative',
    top: '70%',
    right: '2%',
    width: '90px',
    height: '90px',
    borderRadius: '65px',
    alignSelf: "center",
  };
  const buttonStyle2 = {
    position: "absolute",
    display: "block",
    border: 'none',
    outline: 'none',
    backgroundColor: '#fc9400',
    color: '#fff',
    padding: '22px 45px',
    fontSize: '1rem',
    textTransform: 'uppercase',
    borderRadius: '20px',
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.294)',
    bottom:"-5%",
    left: "20%"
  };

  const iconStyle = {
    verticalAlign: 'middle',
  };

  const articleStyle = {
    padding: '1.25em 1.5em',
    whiteSpace: "pre-wrap", // Preserve spaces and line breaks
    position: 'relative',
    maxWidth: '100%', // Add max width to prevent overflow
  };

  const ulStyle = {
    listStyle: 'none',
    margin: '0.5em 0 0',
    padding: '0',
  };

  const liStyle = {
    display: 'block',
    marginLeft: '0em',
    lineHeight: '1em',
    maxWidth: "100%"
  };

  const spanStyle = {
    marginLeft: '0.5em',
    fontSize: '0.8em',
    fontWeight: '300',
    verticalAlign: 'middle',
    color: '#838689',
  };

  const h1Style = {
    margin: '0',
    fontSize: '28px',
    maxWidth: '85%',
    textTransform: "uppercase",
    wordWrap: 'break-word',
    color: '#351897',
    fontWeight: '400'
  };

  const h3Style = {
    margin: '0',
    fontWeight: '300',
    fontSize: '21px',
    color: '#838689',
    maxWidth: '100%',
    wordWrap: 'break-word',
  };


  const pStyle = {
    margin: '1.25em 0',
    fontSize: '16px',
    fontWeight: '400',
    color: "rgb(129, 129, 137)",
    maxWidth: '100%',
    wordWrap: 'break-word'
  };

  const spanIngredientsStyle = {
    margin: '0',
    fontWeight: '400',
    fontSize: '21px',
    color: '#351897',
    maxWidth: '100%',
    wordWrap: 'break-word',
    textTransform: "uppercase"
  };

  return (
    <div style={cardStyle}>
      <div style={{overflowY:"auto"}}>
      <aside style={asideStyle}>
        {image.startsWith('http') ? (
            <img style={imageStyle} src={image} alt={foodName} />
          ) : (
            <img style={imageStyle} src={`data:image/jpeg;base64,${image}`} />
        )}
        <div style={logo}>
        {(picture ? (picture.startsWith('http')):(picture)) ? (
            <img src={`https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg`} alt={foodName} style={buttonStyle} />
          ) : (
              <img src={ picture ?(`data:image/jpeg;base64,${picture}`):(`https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg`)} style={buttonStyle} alt={foodName} />
        )}
        <span className="icon icon-play" style={{
            position:"relative",
            left: "2%",
            bottom: "-85%",
            fontWeight: "bold",
            fontSize: "25px",
            color: "darkcyan",
            alignSelf: "center"
          }}>{userName}</span>
        </div>


      </aside>
      <article style={articleStyle}>
        <h1 style={h1Style}>{title}</h1>
        <h3 style={h3Style}>{foodName}</h3>
        <ul style={ulStyle}>
          <li style={liStyle}><FontAwesomeIcon style={{margin: "0"}} icon={faFire}/><span style={spanStyle}>248</span></li>
        </ul>
        <p style={{...pStyle, color:"black"}}>{description}</p>
        <p style={pStyle}>
          <span style={spanIngredientsStyle}>Ingredients:&nbsp;</span>
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </p>
      </article>
    </div>
        <button style={buttonStyle2} onClick={readmore}>
          Read More
          <FontAwesomeIcon icon={faLongArrowAltRight} style={{marginLeft: '10px'}}/>
      </button>
    </div>
  );
};

export default UserRecipeCard;
