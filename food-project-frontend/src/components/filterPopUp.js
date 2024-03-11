import React, {useEffect, useState} from 'react';
import './filterPopUp.css'
import {useAuth} from "../Context/Context";

const FilterPopup = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const { setfilterPopOn, filterPopOn, Recipes, setRecipes } = useAuth();

  const handleOptionClick = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const sortByLabels = (recipes, labels) => {
  return recipes.slice().sort((a, b) => {
    for (const label of labels) {
      const nutrientA = a.recipe.digest.find(nutrient => nutrient.label === label);
      const nutrientB = b.recipe.digest.find(nutrient => nutrient.label === label);

      if (nutrientA && nutrientB) {
        const diff = nutrientA.total - nutrientB.total; // Changed the comparison order
        if (diff !== 0) {
          return diff;
        }
      }
    }

    return 0;
  });
};


  useEffect(() => {
      if(!filterPopOn){
          document.getElementsByClassName("filter-popup")[0].style.display = "none";
      }else{
          document.getElementsByClassName("filter-popup")[0].style.display = "block";
      }
  }, [filterPopOn])

  const handleApply = async () => {
    // Apply the selected options here
      setfilterPopOn(false);
      await setRecipes(sortByLabels(Recipes, selectedOptions))
  };
  const handleClose = () => {
      setfilterPopOn(false);
  }

  return (
    <div className="filter-popup">
      <div className="filter-header">
        <h2>Filter Options</h2>
        <button style={{backgroundColor: "cornflowerblue"}} onClick={handleClose}>&times;</button>
      </div>
        {Recipes[0] ? (
            <div className="filter-options">
          {Recipes[0].recipe.digest.map((option, index) => (
            <div key={index} className="filter-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option.label)}
                  onChange={() => handleOptionClick(option.label)}
                />
                {option.label}
              </label>
            </div>
          ))}
      </div>
        ):(
            <h1>wait..</h1>
        )}

      <button className="apply-button" onClick={handleApply}>Apply</button>
    </div>
  );
};

export default FilterPopup;
