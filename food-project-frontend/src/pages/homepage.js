import React, {useState} from 'react';
import { useAuth } from '../Context/Context';
import Upload from "../components/upload";
import {useNavigate} from "react-router-dom";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/Recipes/'+query);
  }

  return (
      <Upload style={{
      width: "100%"
    }} />
  );
};

export default HomePage;