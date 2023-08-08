import React from "react";
import { NavLink } from "react-router-dom";

export default function EditReviewButton({ tmdbId }) {
  return (
    <div className="review-button-wrapper">
      <NavLink
        className="detail-prompt"
        to={`/review/edit/${tmdbId}`}
      >
        <button>update</button>
      </NavLink>
    </div>
  );
}
