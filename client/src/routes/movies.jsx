import React from "react";
import { useLoaderData } from "react-router-dom";
import MovieBrief from "../components/MovieBrief";

export default function Movies() {
  const { popularMovies } = useLoaderData();

  const elements = popularMovies.map((movie) => (
    <MovieBrief
      key={movie.tmdbId}
      title={movie.title}
      posterPath={movie.posterPath}
      tmdbId={movie.tmdbId}
    />
  ));

  return <div>{elements}</div>;
}
