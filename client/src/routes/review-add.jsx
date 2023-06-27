import { Form, redirect, useNavigate, useLoaderData } from "react-router-dom";
import { useAuthToken } from "../AuthTokenContext";
import { addReviewToDB } from "../dataFetchFunctions";

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

  await addReviewToDB(
    accessToken,
    tmdbId,
    posterPath,
    movieName,
    content,
    rating
  );

  return redirect(`/movie/${tmdbId}`);
}

export default function ReviewAdd() {
  const { accessToken } = useAuthToken();
  const { movie } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Form className="row profile-form" method="post">
      <label
        className="detail-element detail-prompt profile-element"
        htmlFor="rating-add"
      >
        <strong>Rating</strong>
      </label>
      <textarea
        className="detail-element profile-element edit-content"
        rows={1}
        type="text"
        id="rating-add"
        name="rating"
        placeholder="0 - 10"
      />
      <label
        className="detail-element detail-prompt profile-element"
        htmlFor="content-add"
      >
        <strong>Content</strong>
      </label>
      <textarea
        className="detail-element profile-element edit-content"
        rows={20}
        type="text"
        id="content-add"
        name="content"
        placeholder="write your review"
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
      <input type="hidden" name="movieName" value={movie ? movie.title : ""} />
      <div className="detail-element profile-element button-wrapper">
        <button className="edit-area-button" type="submit">
          add
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
  );
}
