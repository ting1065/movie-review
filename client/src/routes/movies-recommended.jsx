import { useAuthToken } from "../AuthTokenContext";
import MovieBrief from "../components/MovieBrief";
import { useState, useEffect, useLayoutEffect } from "react";
import { getHighestRatedMovieFromDB, getRecommendedMovies } from "../dataFetchFunctions";

export default function MoviesRecommend() {
  const { accessToken } = useAuthToken();
  const [favoriteMovie, setFavoriteMovie] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [elements, setElements] = useState([]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    (async () => {
      const favoriteMovieFetched = await getHighestRatedMovieFromDB(accessToken);
      if (favoriteMovieFetched) {
        setFavoriteMovie(favoriteMovieFetched);
      } else {
        setFavoriteMovie(null);
      }
    })();
  }, [accessToken]);

  useEffect(() => {
    if (favoriteMovie) {
      (async () => {
        setRecommendedMovies(await getRecommendedMovies(favoriteMovie.tmdbId));
      })();
    }
  }, [favoriteMovie]);

  useEffect(() => {
    if (recommendedMovies) {
      setElements(
        recommendedMovies
          .filter((movie) => movie.posterPath !== null)
          .map((movie) => (
            <MovieBrief
              key={movie.tmdbId}
              title={movie.title}
              posterPath={movie.posterPath}
              tmdbRating={movie.rating}
              tmdbId={movie.tmdbId}
            />
          ))
      );
    }
  }, [recommendedMovies]);

  return (
    <>
      <h2>Recommended Movies</h2>
      <p className="page-desciption">Based on your favorite movie: {favoriteMovie ? favoriteMovie.movieName : "none"}</p>
      {elements.length === 0
        ? <p>add at least one review to get recommendation</p>
        : elements}
    </>
  );
}
