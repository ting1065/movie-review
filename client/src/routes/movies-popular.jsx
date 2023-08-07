import React, { useLayoutEffect } from "react";
import { useLoaderData } from "react-router-dom";
import MovieBrief from "../components/MovieBrief";

export default function MoviesPopular() {

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { popularMovies } = useLoaderData();

  const elements = popularMovies
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
      <h2>Trending Movies</h2>
      {elements}
    </>
  );
}
