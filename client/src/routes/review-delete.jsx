import { deleteReviewFromDB } from "../dataFetchFunctions";
import { redirect } from "react-router-dom";

export async function action({ request ,params }) {
  const formData = await request.formData();
  const accessToken = formData.get("accessToken");
  await deleteReviewFromDB(accessToken, params.tmdbId);
  return redirect(`/movie/${params.tmdbId}`);
}