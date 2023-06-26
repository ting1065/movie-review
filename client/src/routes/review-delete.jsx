import { deleteReviewFromDB } from "../functions";

export async function action({ request ,params }) {
  const formData = await request.formData();
  const accessToken = formData.get("accessToken");
  await deleteReviewFromDB(accessToken, params.tmdbId);
  return window.location.replace(`/movie/${params.tmdbId}`);
}