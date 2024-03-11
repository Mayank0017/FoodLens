import React from 'react';
import './SkelitonCard.css'; // Create a CSS file for styling

const SkeletonRecipeCard = () => (
  <div className="skeleton-recipe-card">
    <img src={"https://e7.pngegg.com/pngimages/599/45/png-clipart-computer-icons-loading-chart-hand-circle.png"}/>
    <div className="skeleton-profile"></div>
    <div className="skeleton-title"></div>
    <div className="skeleton-image"></div>
    <div className="skeleton-description"></div>
  </div>
);

export default SkeletonRecipeCard;
