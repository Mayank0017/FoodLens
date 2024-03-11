import React, { useEffect, useState } from 'react';
import "./landing.css"
import hsl from 'hsl-to-hex';
import {Link} from "react-router-dom";
import Carousel from "../components/Carousel";


const LandingPage = () => {
  useEffect(() => {
    const random = (min, max) => Math.random() * (max - min) + min;

    const map = (n, start1, end1, start2, end2) =>
      ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;

    const setColors = () => {
      const hue = ~~random(220, 360);
      const complimentaryHue1 = hue + 30;
      const complimentaryHue2 = hue + 60;
      const bgGradient = `linear-gradient(
        to bottom,
        hsl(var(--hue), 95%, 99%),
        hsl(var(--hue), 95%, 84%)
      )`;
      document.documentElement.style.setProperty("--bg-gradient", bgGradient);
      document.documentElement.style.setProperty("--hue", hue);
      document.documentElement.style.setProperty("--hue-complimentary1", complimentaryHue1);
      document.documentElement.style.setProperty("--hue-complimentary2", complimentaryHue2);
    };
    setColors();
  }, []);

  return (
    <div className="classMayank">
        <Carousel />
      <canvas className="orb-canvas"/>
      <div className="overlay">
        <div className="overlay__inner">
          <h1 className="overlay__title">
            <span className="text-gradient">Revolutionize Dining</span>: Accurate
            <span className="text-gradient"> Deep Learning </span>
            Tool Identifies Dishes for Culinary Enthusiasts and Professionals.

          </h1>
          <p className="overlay__description">
            Discover dishes from diverse cuisines worldwide, accompanied by expertly curated recipes. Whether you're a seasoned chef or a passionate home cook, our community shares their culinary expertise to enhance your cooking experience. Explore, learn, and create delightful meals with us!
            <strong> From kitchens around the world to yours, discover, cook, and savor every flavorful journey.</strong>
          </p>
          <div className="overlay__btns">
            <button className="overlay__btn overlay__btn--transparent">
              <Link to="/signup">
                <span className="text-gradient">Get Started</span>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
