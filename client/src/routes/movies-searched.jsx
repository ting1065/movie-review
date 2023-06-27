import React, {useLayoutEffect} from 'react'
import { useLoaderData } from "react-router-dom";
import MovieBrief from "../components/MovieBrief";

export default function MoviesSearched() {
  
  const { searchedMovies, searchName } = useLoaderData();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const elements = searchedMovies
    .filter((movie) => movie.posterPath !== null)
    .map((movie) => (
      <MovieBrief
        key={movie.tmdbId}
        title={movie.title}
        posterPath={movie.posterPath}
        tmdbRating={movie.rating}
        tmdbId={movie.tmdbId}
      />
    ));

  return (
  <>
    <h2>Search results for {searchName}</h2>
    {elements}
  </>
  );
}
