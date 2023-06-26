import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Root from './routes/root.jsx';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import ErrorPage from './routes/error-page.jsx';
import Movies from './routes/movies.jsx';
import MovieDetail from './routes/movie-detail';
import ReviewDetail from './routes/review-detail';
import ReviewAdd, {action as addReviewAction} from './routes/review-add';
import ReviewEdit, { action as editReviewAction } from './routes/review-edit';
import { action as reviewDeleteAction } from './routes/review-delete';
import UserProfile from './routes/user-profile';
import UserProfileEdit, {action as editProfileAction } from './routes/user-profile-edit';
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";
import VerifyUser from "./routes/verify-user";
import AuthDebugger from './routes/auth-debugger';
import {
  getMovieFromTmdb,
  getReviewsFromTmdb,
  getPopularMovies,
} from "./functions";
import MoviesReviewed from './routes/movies-reviewed';
import MoviesRecommended from './routes/movies-recommended';

const requestedScope = "profile email";


function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

//reviews loader
async function reviewsLoader({params}) {
  const tmdbId = params.tmdbId;
  const movie = await getMovieFromTmdb(tmdbId);
  const tmdbReviews = await getReviewsFromTmdb(tmdbId);
  return { tmdbId, movie, tmdbReviews };
}

//movies loader
async function moviesLoader() {
  const popularMovies = await getPopularMovies();
  return { popularMovies };
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <></>,
        children: [
          {
            //popular movies
            index: true,
            element: <Movies />,
            loader: moviesLoader,
          },
          {
            //reviewed movies
            path: "movies/reviewed",
            element: <RequireAuth><MoviesReviewed /></RequireAuth>,
          },
          {
            //recommended movies
            path: "movies/recommended",
            element: <RequireAuth><MoviesRecommended /></RequireAuth>,
          },
          {
            path: "movie/:tmdbId",
            element: <MovieDetail />,
            loader: reviewsLoader,
          },
          {
            path: "review/:reviewId",
            element: <RequireAuth><ReviewDetail /></RequireAuth>,
          },
          {
            path: "review/add/:tmdbId",
            element: <RequireAuth><ReviewAdd /></RequireAuth>,
            loader: reviewsLoader,
            action: addReviewAction,
          },
          {
            path: "review/edit/:tmdbId",
            element: <RequireAuth><ReviewEdit /></RequireAuth>,
            loader: reviewsLoader,
            action: editReviewAction,
            
          },
          {
            path: "review/edit/:tmdbId/delete",
            action: reviewDeleteAction,
            errorElement: <div>an error happened</div>
          },
          {
            path: "profile",
            element: <RequireAuth><UserProfile /></RequireAuth>,
          },
          {
            path: "profile/edit",
            element: <RequireAuth><UserProfileEdit /></RequireAuth>,
            action: editProfileAction,
          },
          {
            path: "verify-user",
            element: <RequireAuth><VerifyUser /></RequireAuth>,
          },
          {
            path: "auth-debugger",
            element: <RequireAuth><AuthDebugger /></RequireAuth>,
          },

        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: requestedScope,
      }}
    >
      <AuthTokenProvider>
        <RouterProvider router={router} />
      </AuthTokenProvider>  
    </Auth0Provider>
  </React.StrictMode>
);