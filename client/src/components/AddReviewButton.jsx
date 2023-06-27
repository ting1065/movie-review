import React from "react";
import { NavLink } from "react-router-dom";

export default function AddReviewButton({ tmdbId }) {
  return (
    <>
      <p className="detail-element detail-prompt">
        you have not reviewed this movie yet
      </p>
      <NavLink
        className="detail-element detail-prompt"
        to={`/review/add/${tmdbId}`}
      >
        <button>add one</button>
      </NavLink>
    </>
  );
}
