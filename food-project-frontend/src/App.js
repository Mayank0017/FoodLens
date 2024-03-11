import './App.css';
import Login from "./pages/login";
import {Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Navbar from "./components/navbar";
import Signup from "./pages/signup";
import LandingPage from "./pages/landing";
import {useAuth} from "./Context/Context";
import HomePage from "./pages/homepage";
import Recipes from "./pages/Recipes";
import UserRecipePage from "./pages/UserRecipePage";
import React from "react";
function App() {
  const { user, checktoken, setUser } = useAuth();
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  if (user===null) {
    checktoken(token);
  }

  return (
<Router>
    <div className="App">
      <Navbar />
      <Routes>
        <Route exact path="/" element={isAuthenticated && user ? <HomePage /> : <LandingPage />} />
        <Route exact path="/login" element={isAuthenticated && user ?<HomePage /> : <Login />} />
        <Route exact path="/signup" element={isAuthenticated && user ?<HomePage /> : <Signup />} />
        <Route exact path="/Recipes/:foodName" element={<Recipes />} />
        <Route exact path="/Recipes/:foodName/:RecipeId" element={<UserRecipePage />} />
      </Routes>
    </div>
</Router>
  );
}

export default App;
