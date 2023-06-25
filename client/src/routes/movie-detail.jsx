import React, { useEffect, useState } from "react";
import {
  getMovieFromTmdb,
  getReviewsFromTmdb,
  getReviewFromDB,
  getReviewsFromOtherUsers,
} from "../functions";
import { useLoaderData } from "react-router-dom";
import { useAuthToken } from "../AuthTokenContext";
import { useAuth0 } from "@auth0/auth0-react";

export async function loader({ params }) {
  const tmdbId = params.tmdbId;
  const movie = await getMovieFromTmdb(tmdbId);
  const tmdbReviews = await getReviewsFromTmdb(tmdbId);
  return { tmdbId, movie, tmdbReviews };
}

export default function MovieDetail({ params }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { tmdbId, movie, tmdbReviews } = useLoaderData();
  const { accessToken } = useAuthToken();
  const [userReview, setUserReview] = useState(null);
  const [reviewsFromOthers, setReviewsFromOthers] = useState([]);
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    (async () => {
      setUserReview(await getReviewFromDB(accessToken, tmdbId));
      setReviewsFromOthers(await getReviewsFromOtherUsers(accessToken, tmdbId));
    })();
  }, [accessToken, tmdbId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div>
        <h2>{movie.title}</h2>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
          alt={movie.title}
        />
        <p>released date: {movie.releasedDate}</p>
        <p>tmdb rating: {movie.rating}</p>
        <p>overview: {movie.overview}</p>
      </div>

      <div>
        <h2>your review</h2>
        {isAuthenticated ? (
          userReview ? (
            <div>
              <p>rating: {userReview.rating}</p>
              <p>content: {userReview.content}</p>
            </div>
          ) : (
            <div>
              <p>you have not reviewed this movie yet</p>
            </div>
          )
        ) : (
          <div>
            <p>only a prime member shall enjoy such fancy feature</p>
          </div>
        )}
      </div>

      <div>
        <h2>reviews from other users</h2>
        {isAuthenticated ? (
          reviewsFromOthers ? (
            reviewsFromOthers.length > 0 ? (
              reviewsFromOthers.map((review) => (
                <div key={review.id}>
                  <p>author: {review.author.name}</p>
                  <p>rating: {review.rating}</p>
                  <p>content: {review.content}</p>
                </div>
              ))
            ) : (
              <div>
                <p>no reviews from other users yet</p>
              </div>
            )
          ) : (
            <div>
              <p>no reviews from other users yet</p>
            </div>
          )
        ) : (
          <div>
            <p>only a prime member shall enjoy such fancy feature</p>
          </div>
        )}
      </div>

      <div>
        <h2>reviews from tmdb</h2>
        {tmdbReviews.map((review) => (
          <div key={review.id}>
            <p>author: {review.author}</p>
            <p>rating: {review.rating ? review.rating : "n/a"}</p>
            <p>content: {review.content}</p>
          </div>
        ))}
      </div>
    </>
  );
}
