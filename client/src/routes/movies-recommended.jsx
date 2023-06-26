import { useAuthToken } from "../AuthTokenContext";
import MovieBrief from "../components/MovieBrief";
import { useState, useEffect } from "react";
import { getHighestRatedMovieFromDB, getRecommendedMovies } from "../functions";

export default function MoviesRecommend() {
  const { accessToken } = useAuthToken();
  const [tmdbIdOfFav, setTmdbIdOfFav] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [elements, setElements] = useState([]);

  useEffect(() => {
    (async () => {
      const tmdbIdOfFavGot = await getHighestRatedMovieFromDB(accessToken);
      if (tmdbIdOfFavGot) {
        setTmdbIdOfFav(parseInt(tmdbIdOfFavGot));
      } else {
        setTmdbIdOfFav(null);
      }
    })();
  }, [accessToken]);

  useEffect(() => {
    if (tmdbIdOfFav) {
      (async () => {
        setRecommendedMovies(await getRecommendedMovies(tmdbIdOfFav));
      })();
    }
  }, [tmdbIdOfFav]);

  useEffect(() => {
    if (recommendedMovies) {
      setElements(
        recommendedMovies
          .filter((movie) => movie.posterPath !== null)
          .map((movie) => (
            <MovieBrief
              key={movie.tmdbId}
              title={movie.movieName}
              posterPath={movie.posterPath}
              tmdbId={movie.tmdbId}
            />
          ))
      );
    }
  }, [recommendedMovies]);

  return (
    <div>
      {elements.length === 0
        ? "add at least one review to get recommendation"
        : elements}
    </div>
  );
}
