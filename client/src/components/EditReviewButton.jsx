import React from 'react'
import { NavLink } from 'react-router-dom';

export default function EditReviewButton({tmdbId}) {
  return (
    <div>
      <NavLink to={`/review/edit/${tmdbId}`}>
        <button>update</button>
      </NavLink>
    </div>
  )
}