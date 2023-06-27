import { useAuthToken } from "../AuthTokenContext";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { useLoaderData } from "react-router-dom";
import MovieBrief from "../components/MovieBrief";
import { useAuth0 } from "@auth0/auth0-react";
import { getHighestRatedMovieFromDB } from "../dataFetchFunctions";

export default function MoviesPopular() {
  const [favoriteMovie, setFavoriteMovie] = useState(null);
  const [favoriteMovieSection, setFavoriteMovieSection] = useState(<></>);
  const { isAuthenticated } = useAuth0();
  const { accessToken } = useAuthToken();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { popularMovies } = useLoaderData();

  useEffect(() => {
    (async () => {
      const favoriteMovieFetched = await getHighestRatedMovieFromDB(
        accessToken
      );
      if (favoriteMovieFetched) {
        setFavoriteMovie(favoriteMovieFetched);
      } else {
        setFavoriteMovie(null);
      }
    })();
  }, [accessToken]);

  useEffect(() => {
    if (favoriteMovie) {
      setFavoriteMovieSection(
        <div className="row">
          <MovieBrief
            key={favoriteMovie.tmdbId}
            title={favoriteMovie.movieName}
            posterPath={favoriteMovie.posterPath}
            tmdbId={favoriteMovie.tmdbId}
            rating={favoriteMovie.rating}
          />
        </div>
      );
    }
  }, [favoriteMovie]);

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
      <h2>Your Highest Rated Movie</h2>
      {isAuthenticated ? (
        favoriteMovie ? (
          favoriteMovieSection
        ) : (
          <p className="page-desciption">no review made yet</p>
        )
      ) : (
        <p className="page-desciption">
          only a prime member shall enjoy such fancy feature
        </p>
      )}
      <h2>Trending Movies</h2>
      {elements}
    </>
  );
}
