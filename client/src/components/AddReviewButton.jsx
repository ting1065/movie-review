import React from "react";
import { NavLink } from "react-router-dom";

export default function AddReviewButton({ tmdbId }) {
  return (
    <>
      <p className="review-element detail-prompt">
        you have not reviewed this movie yet
      </p>
      <div className="review-button-wrapper">
        <NavLink className="detail-prompt" to={`/review/add/${tmdbId}`}>
          <button>add one</button>
        </NavLink>
      </div>
    </>
  );
}
