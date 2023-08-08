import React from "react";

export default function SingleReviewFromOther({ author, rating, content }) {
  return (
    <div className="review-wrapper">
      <p className="review-element">
        <strong>Author:</strong>
        {` ${author}`}
      </p>
      <p className="review-element">
        <strong>Rating:</strong>
        {` ${rating}`}
      </p>
      <p className="review-element  review-content">
        <strong>Content:</strong>
        <br></br>
        <br></br>
        {content}
        <br></br>
        <br></br>
      </p>
    </div>
  );
}
