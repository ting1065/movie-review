import { useAuthToken } from "../AuthTokenContext";
import MovieBrief from "../components/MovieBrief";
import { useState, useEffect, useLayoutEffect } from "react";
import { getReviewedMoviesFromDB } from "../dataFetchFunctions";

export default function MoviesReviewed() {

  const { accessToken } = useAuthToken();
  const [moviesReviewed, setMoviesReviewed] = useState([]);
  const [elements, setElements] = useState([]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          rating={movie.rating}
        />
      )));

    }
  }, [moviesReviewed]);


  return (
    <>
      <h2>Reviewed Movies</h2>
      {elements.length===0 ? <p className="page-desciption" >no movie reviewed yet...</p> : elements}
    </>
  )
}