import React from 'react'
import { NavLink } from 'react-router-dom';

export default function EditReviewButton({tmdbId}) {
  return (
    <NavLink className="detail-element detail-prompt" to={`/review/edit/${tmdbId}`}>
    <button>update</button>
    </NavLink>
  )
}