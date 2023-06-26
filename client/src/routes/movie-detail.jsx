import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  getReviewFromDB,
  getReviewsFromOtherUsers,
} from "../functions";
import { useLoaderData } from "react-router-dom";
import { useAuthToken } from "../AuthTokenContext";
import { useAuth0 } from "@auth0/auth0-react";
import AddReviewButton from "../components/AddReviewButton";
import EditReviewButton from "../components/EditReviewButton";


export default function MovieDetail() {
  const { tmdbId, movie, tmdbReviews} = useLoaderData();
  const { accessToken } = useAuthToken();
  const [userReview, setUserReview] = useState(null);
  const [reviewsFromOthers, setReviewsFromOthers] = useState([]);
  const { isAuthenticated } = useAuth0();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    (async () => {
      setUserReview(await getReviewFromDB(accessToken, tmdbId));
    })();
  }, [accessToken, tmdbId]);

  useEffect(() => {
    (async () => {
      setReviewsFromOthers(await getReviewsFromOtherUsers(accessToken, tmdbId));
    })();
  }, [accessToken, tmdbId]);

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
              <EditReviewButton tmdbId={tmdbId ? tmdbId : ""} />
            </div>
          ) : (
            <AddReviewButton tmdbId={tmdbId ? tmdbId : ""} />
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
