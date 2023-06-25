import React from "react";
import { useLoaderData } from "react-router-dom";
import { getPopularMovies } from "../functions";
import MovieBrief from "../components/MovieBrief";

export async function loader() {
  const popularMovies = await getPopularMovies();
  return { popularMovies };
}

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
