import React from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';

export default function GetRatings({ value }) {
  const totalRatings = [0, 0, 0, 0, 0];
  for (let i = 0; i < Math.round(parseInt(value)); i++) {
    totalRatings[i] = 1;
  }
  return (
    <div className="flex items-center">
      {totalRatings.map((rating) => {
        if (rating === 1) {
          return <FaStar key={rating.toString()} />;
        }
        return <FaRegStar key={rating.toString()} />;
      })}
    </div>
  );
}
