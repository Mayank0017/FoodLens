import React, { useState } from 'react';
import axios from "axios";
import './upload.css';
import logo from '../images/upload_page.png'
import im from '../images/upload_icon.png'
import {useNavigate} from "react-router-dom";

const FileUploadUI = () => {
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isFileSaved, setIsFileSaved] = useState(false);
  const [file, setFile] = useState();
  const formData = new FormData();
  const navigate = useNavigate();


  const handleFileUpload = async (base64String) => {
    setIsFileUploaded(true);
    setTimeout(() => {
      setIsFileUploaded(false);
      setIsFileSaved(true);
      setTimeout(() => {
        setIsFileSaved(false);
      }, 1000);
    }, 2000);
    try {
      const response = await axios.post('http://localhost:8080/image', {
      base64File: base64String,
    });
      navigate('/Recipes/' + response.data.class);
    } catch (err) {
      console.log(err);
    }

  };






  const handleSaveFile = () => {
    setIsFileSaved(false);
  };

  const handleFileSelection = () => {
    const inputFile = document.createElement('input');
    inputFile.type = 'file';

    inputFile.addEventListener('change', async (event) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        handleFileUpload(base64String);
      };

      reader.readAsDataURL(event.target.files[0]);
    });

    inputFile.click();
  };


  return (
    <div className="file-upload-ui">
      <img style={{
        width: 350,
        height: "auto"
      }}
          src={logo} alt="Description of the image" />
      {!isFileSaved ? (
        <div className="upload-box">
          <div className="dotted-border" onClick={handleFileSelection}>
            {isFileUploaded ? (
              <div className="processing-animation">
                <div className="circle1" />
                <div className="circle2" />
                <div className="circle3" />
              </div>
            ) : (
              <div className="upload-contents">
                <img
                style={{
                      opacity: 2,
                      width: 350,
                      height: "auto"
                    }}
                    src={im}/>
                <div className="drag-drop">
                  Drag & Drop
                </div>
                <div className="upload-note">
                  Your Files here Or Browse to Upload
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="success-message">
        <h2>File Successfully Saved!</h2>
      </div>
      )}
    </div>
  );
};

export default FileUploadUI;
