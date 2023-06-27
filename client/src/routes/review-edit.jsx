import React, { useEffect, useState } from "react";
import { Form, redirect, useNavigate, useLoaderData } from "react-router-dom";
import { useAuthToken } from "../AuthTokenContext";
import { updateReviewInDB, getReviewFromDB } from "../dataFetchFunctions";

export async function action({ request }) {
  const formData = await request.formData();
  const accessToken = formData.get("accessToken");
  const tmdbId = parseInt(formData.get("tmdbId"));
  const posterPath = formData.get("posterPath");
  const movieName = formData.get("movieName");
  const content = formData.get("content");
  const rating = parseFloat(formData.get("rating"));

  if (!rating || rating < 0 || rating > 10) {
    alert("invalid rating!");
    return redirect(`/review/edit/${tmdbId}`);
  }

  if (!content) {
    alert("seriously? say something!");
    return redirect(`/review/edit/${tmdbId}`);
  }

  if (content.length > 1000) {
    alert("content too long, no more than 1000 characters");
    return redirect(`/review/edit/${tmdbId}`);
  }

  await updateReviewInDB(
    accessToken,
    tmdbId,
    posterPath,
    movieName,
    content,
    rating
  );

  return redirect(`/movie/${tmdbId}`);
}

export default function ReviewEdit({ params }) {
  const { accessToken } = useAuthToken();
  const { tmdbId, movie } = useLoaderData();
  const [userReview, setUserReview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setUserReview(await getReviewFromDB(accessToken, tmdbId));
    })();
  }, [accessToken, tmdbId]);

  return (
    <>
      <Form className="row profile-form" method="post">
        <label
          className="detail-element detail-prompt profile-element"
          htmlFor="rating"
        >
          rating
        </label>
        <textarea
          className="detail-element profile-element edit-content"
          rows={1}
          type="text"
          name="rating"
          placeholder="0 - 10"
          defaultValue={userReview ? userReview.rating : ""}
        />
        <label
          className="detail-element detail-prompt profile-element"
          htmlFor="content"
        >
          content
        </label>
        <textarea
          className="detail-element profile-element edit-content"
          rows={20}
          type="text"
          name="content"
          placeholder="write your review"
          defaultValue={userReview ? userReview.content : ""}
        />
        <input
          type="hidden"
          name="accessToken"
          value={accessToken ? accessToken : ""}
        />
        <input type="hidden" name="tmdbId" value={movie ? movie.tmdbId : ""} />
        <input
          type="hidden"
          name="posterPath"
          value={movie ? movie.posterPath : ""}
        />
        <input
          type="hidden"
          name="movieName"
          value={movie ? movie.title : ""}
        />
        <div className="detail-element profile-element button-wrapper">
          <button className="edit-area-button" type="submit">
            update
          </button>
          <button
            className="edit-area-button"
            type="button"
            onClick={() => {
              navigate(-1);
            }}
          >
            cancel
          </button>
        </div>
      </Form>

      <Form className="row profile-form" action="delete" method="post">
        <div className="detail-element profile-element button-wrapper">
          <button className="edit-area-button" type="submit">
            delete
          </button>
          <input
            type="hidden"
            name="accessToken"
            value={accessToken ? accessToken : ""}
          />
        </div>
      </Form>
    </>
  );
}
