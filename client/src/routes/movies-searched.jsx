import React from 'react'
import { useLoaderData } from "react-router-dom";
import MovieBrief from "../components/MovieBrief";

export default function MoviesSearched() {
  
  const { searchedMovies, searchName } = useLoaderData();
  
  const elements = searchedMovies
    .filter((movie) => movie.posterPath !== null)
    .map((movie) => (
      <MovieBrief
        key={movie.tmdbId}
        title={movie.title}
        posterPath={movie.posterPath}
        tmdbId={movie.tmdbId}
      />
    ));

  return (
  <div>
    <h2>Search results for {searchName}</h2>
    {elements}
  </div>
  );
}
