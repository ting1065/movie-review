import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  getReviewFromDB,
  getReviewsFromOtherUsers,
} from "../dataFetchFunctions";
import { useLoaderData } from "react-router-dom";
import { useAuthToken } from "../AuthTokenContext";
import { useAuth0 } from "@auth0/auth0-react";
import AddReviewButton from "../components/AddReviewButton";
import EditReviewButton from "../components/EditReviewButton";
import SingleReviewFromOther from "../components/SingleReviewFromOther";

export default function MovieDetail() {
  const { tmdbId, movie, tmdbReviews } = useLoaderData();
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
      setReviewsFromOthers(await getReviewsFromOtherUsers(accessToken, tmdbId));
    })();
  }, [accessToken, tmdbId]);

  return (
    <>
      <h2>{movie.title}</h2>
      <img
        className="detail-image"
        src={`https://image.tmdb.org/t/p/original${movie.posterPath}`}
        alt={movie.title}
      />
      <p className="detail-element">
        <strong>Released Date:</strong> {` ${movie.releasedDate}`}
      </p>
      <p className="detail-element">
        <strong>TMDB Rating:</strong>
        {` ${movie.rating ? movie.rating.toFixed(1) : " n/a"}`}
      </p>
      <p className="detail-element review-content">
        <strong>Overview:</strong>
        <br></br>
        <br></br>
        {movie.overview}
        <br></br>
        <br></br>
      </p>

      <h3 className="detail-element  detail-subtitle">Your Review</h3>
      <div className="review-wrapper">
        {isAuthenticated ? (
          userReview ? (
            <>
              <p className="review-element">
                <strong>Rating:</strong>
                {` ${userReview.rating.toFixed(1)}`}
              </p>
              <p className="review-element  review-content">
                <strong>Content:</strong>
                <br></br>
                <br></br>
                {userReview.content}
                <br></br>
                <br></br>
              </p>
              <EditReviewButton tmdbId={tmdbId ? tmdbId : ""} />
            </>
          ) : (
            <AddReviewButton tmdbId={tmdbId ? tmdbId : ""} />
          )
        ) : (
          <p className="review-element detail-prompt">
            login to post your review
          </p>
        )}
      </div>

      <h3 className="detail-element  detail-subtitle">
        Reviews From Other Users
      </h3>
      {isAuthenticated ? (
        reviewsFromOthers ? (
          reviewsFromOthers.length > 0 ? (
            reviewsFromOthers.map((review) => (
              <SingleReviewFromOther
                key={review.id}
                author={review.author.name}
                rating={review.rating.toFixed(1)}
                content={review.content}
              />
            ))
          ) : (
            <div className="review-wrapper">
              <p className="review-element detail-prompt">
                no reviews from other users yet
              </p>
            </div>
          )
        ) : (
          <div className="review-wrapper">
            <p className="review-element detail-prompt">
              no reviews from other users yet
            </p>
          </div>
        )
      ) : (
        <div className="review-wrapper">
          <p className="review-element detail-prompt">
            login to see what other users say
          </p>
        </div>
      )}

      <h3 className="detail-element detail-subtitle">Reviews From TMDB</h3>
      {tmdbReviews ? (
        tmdbReviews.length !== 0 ? (
          tmdbReviews.map((review) => (
            <SingleReviewFromOther
              key={review.id}
              author={review.author}
              rating={review.rating ? review.rating.toFixed(1) : "n/a"}
              content={review.content}
            />
          ))
        ) : (
          <div className="review-wrapper">
            <p className="review-element detail-prompt">
              no review on this movie yet
            </p>
          </div>
        )
      ) : (
        <div className="review-wrapper">
          <p className="review-element detail-prompt">
            no review on this movie yet
          </p>
        </div>
      )}
    </>
  );
}
