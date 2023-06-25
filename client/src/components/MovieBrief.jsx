import React from 'react'
import { NavLink } from 'react-router-dom';

export default function MovieBrief({title, posterPath, tmdbId}) {
  return (
    <div>
      <h2>{title}</h2>
      <img src={`https://image.tmdb.org/t/p/w342${posterPath}`} alt={title} />
      <NavLink to={`/movie/${tmdbId}`}>details</NavLink>
    </div>
  )
}
