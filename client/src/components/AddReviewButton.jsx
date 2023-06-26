import React from 'react'
import { NavLink } from 'react-router-dom';

export default function AddReviewButton({tmdbId}) {
  return (
    <div>
      <p>you have not reviewed this movie yet</p>
      <NavLink to={`/review/add/${tmdbId}`}>
        <button>add one</button>
      </NavLink>
    </div>
  )
}