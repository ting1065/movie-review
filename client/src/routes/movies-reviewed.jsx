import { useAuthToken } from "../AuthTokenContext";
import MovieBrief from "../components/MovieBrief";
import { useState, useEffect } from "react";
import { getReviewedMoviesFromDB } from "../functions";

export default function MoviesReviewed() {

  const { accessToken } = useAuthToken();
  const [moviesReviewed, setMoviesReviewed] = useState([]);
  const [elements, setElements] = useState([]);

  useEffect(() => {
    (async () => {
      setMoviesReviewed(await getReviewedMoviesFromDB(accessToken));
    })();
  }, [accessToken]);

  useEffect(() => {
    if (moviesReviewed) {

      setElements( moviesReviewed.map((movie) => (
        <MovieBrief
          key={movie.tmdbId}
          title={movie.movieName}
          posterPath={movie.posterPath}
          tmdbId={movie.tmdbId}
        />
      )));
      
    }
  }, [moviesReviewed]);


  return (
    <div>{elements.length===0 ? "you haven't reviewed yet" : elements}</div>
  )
}