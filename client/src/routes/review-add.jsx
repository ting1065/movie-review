import { Form, redirect, useNavigate, useLoaderData} from "react-router-dom";
import { useAuthToken } from "../AuthTokenContext";
import { addReviewToDB } from "../functions";

export async function action({request}) {
  const formData = await request.formData();
  const accessToken = formData.get("accessToken");
  const tmdbId = parseInt(formData.get("tmdbId"));
  const posterPath = formData.get("posterPath");
  const movieName = formData.get("movieName");
  const content = formData.get("content");
  const rating = parseFloat(formData.get("rating"));

  if (!rating || rating < 0 || rating > 10 || !content) {
    alert("invalid input");
    return redirect(`/review/add/${tmdbId}`);
  }

  await addReviewToDB(accessToken, tmdbId, posterPath, movieName, content, rating);
  
  return window.location.replace(`/movie/${tmdbId}`);
}


export default function ReviewAdd() {
  const { accessToken } = useAuthToken();
  const { movie } = useLoaderData();
  const navigate = useNavigate();


  return (
    <Form method="post">
      <div>
        <label htmlFor="rating">rating</label>
        <textarea rows={1} type="text" name="rating"  placeholder="0 - 10"/>
        <label htmlFor="content">content</label>
        <textarea type="text" name="content"  placeholder="write your review"/>
        <input type="hidden" name="accessToken" value={accessToken ? accessToken : ""}/>
        <input type="hidden" name="tmdbId" value={movie ? movie.tmdbId : ""}/>
        <input type="hidden" name="posterPath" value={movie ? movie.posterPath : ""}/>
        <input type="hidden" name="movieName" value={movie ? movie.title : ""}/>
        <button type="submit">add</button>
        <button type="button" onClick={() => {
            navigate(-1);
          }}>cancel</button>
      </div>
    </Form>
  );
}