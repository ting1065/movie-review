import React from "react";
import { NavLink } from "react-router-dom";

export default function MovieBrief({
  title,
  posterPath,
  tmdbRating,
  tmdbId,
  rating,
}) {
  return (
    <div className="brief-frame">
      <h3 className="frame-content brief-title">{title}</h3>
      <img
        className="frame-content brief-image"
        src={`https://image.tmdb.org/t/p/original${posterPath}`}
        alt={title}
      />
      <p className="frame-content frame-text">
        {tmdbRating
          ? `TMDB rating: ${tmdbRating.toFixed(1)}`
          : rating
          ? `Your rating: ${rating.toFixed(1)}`
          : `TMDB rating: n/a`}
      </p>
      <div className="frame-content">
        <NavLink to={`/movie/${tmdbId}`}>Details</NavLink>
      </div>
    </div>
  );
}
