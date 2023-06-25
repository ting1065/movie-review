import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Root from './routes/root.jsx';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import ErrorPage from './routes/error-page.jsx';
import Movies, {loader as moviesLoader} from './routes/movies.jsx';
import MovieDetail, {loader as movieDetailLoader} from './routes/movie-detail';
import ReviewDetail from './routes/review-detail';
import ReviewEdit from './routes/review-edit';
import ReviewDelete from './routes/review-delete';
import UserProfile from './routes/user-profile';
import UserProfileEdit, {action as editProfileAction } from './routes/user-profile-edit';
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";
import VerifyUser from "./routes/verify-user";
import AuthDebugger from './routes/auth-debugger';

const requestedScope = "profile email";

function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Movies />,
            loader: moviesLoader,
          },
          {
            path: "movies/reviewed/:userId",
            element: <RequireAuth><Movies /></RequireAuth>,
          },
          {
            path: "movies/recommended/:userId",
            element: <RequireAuth><Movies /></RequireAuth>,
          },
          {
            path: "movie/:tmdbId",
            element: <MovieDetail />,
            loader: movieDetailLoader,
          },
          {
            path: "review/:reviewId",
            element: <RequireAuth><ReviewDetail /></RequireAuth>,
          },
          {
            path: "review/:reviewId/edit",
            element: <RequireAuth><ReviewEdit /></RequireAuth>,
          },
          {
            path: "review/:reviewId/delete",
            element: <RequireAuth><ReviewDelete /></RequireAuth>,
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