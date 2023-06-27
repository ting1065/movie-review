import React from "react";

export default function SingleReviewFromOther({ author, rating, content }) {
  return (
    <>
      <p className="detail-element">
        <strong>Author:</strong>
        {` ${author}`}
      </p>
      <p className="detail-element">
        <strong>Rating:</strong>
        {` ${rating}`}
      </p>
      <p className="detail-element  review-content">
        <strong>Content:</strong>
        <br></br>
        <br></br>
        {content}
        <br></br>
        <br></br>
      </p>
    </>
  );
}
