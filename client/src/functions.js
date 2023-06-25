const tmdbToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMDMwODhiZWIwMTA2MmRjMTMzMjY5Y2U5Y2MxY2M0OSIsInN1YiI6IjY0OTM5YjI1YWY2ZTk0MDBhZGVjMTNhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ey1XtAsnN9ZhoYOsoU9YtKHeMjvvcx2fDwcmpqYVHIk";

//extract a brief json from a single movie's json from tmdb api
function extractMovieDataBrief(movie) {
  return {
    tmdbId: movie.id,
    title: movie.title,
    posterPath: movie.poster_path,
  };
}

//extract a detailed json from a single movie's json from tmdb api
function extractMovieDataDetail(movie) {
  return {
    tmdbId: movie.id,
    title: movie.title,
    posterPath: movie.poster_path,
    releasedDate: movie.release_date,
    rating: movie.vote_average,
    overview: movie.overview,
  };
}

//extract essential info from a single review's json from tmdb api
function extractReviewData(review) {
  return {
    id: review.id,
    author: review.author,
    rating: review.author_details.rating,
    content: review.content,
  };
}

//get popular movies from tmdb api
export async function getPopularMovies() {
  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${tmdbToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const movies = data.results.map((movie) => extractMovieDataBrief(movie));
    return movies;
  } catch (error) {
    console.log(error);
  }
}

//get a single movie using tmdb id from tmdb api
export async function getMovieFromTmdb(tmdbId) {

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?language=en-US`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${tmdbToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const movieFromTmdb = extractMovieDataDetail(data);
    return movieFromTmdb;
  } catch (error) {
    console.log(error);
  }
}

//get a single movie's reviews using tmdb id from tmdb api
export async function getReviewsFromTmdb(tmdbId) {

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}/reviews?language=en-US&page=1`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${tmdbToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const reviewsFromTmdb = data.results.map((review) => extractReviewData(review));

    return reviewsFromTmdb;

  } catch (error) {
    console.log(error);
  }
}

//get a user info from database using access token
export async function getUserFromDB(accessToken) {
  if (!accessToken) return;
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const userFromDB = await response.json();

    return userFromDB;
  } catch (error) {
    console.log(error);
  }

}

//get a user's review for a single movie from database using access token and tmdb id
export async function getReviewFromDB(accessToken, tmdbId) {
  if (!accessToken || !tmdbId) return;
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/review/${tmdbId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 404) {
      console.log(response);
      return;
    } else if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const reviewFromDB = await response.json();
  
    return reviewFromDB;

  } catch (error) {
    console.log(error);
  }

}

//get a single movie's reviews from other users
export async function getReviewsFromOtherUsers(accessToken, tmdbId) {
  if (!accessToken || !tmdbId) return;
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/reviews/${tmdbId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 404) {
      console.log(response);
      return;
    } else if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const reviewsFromOtherUsers = await response.json();
  
    return reviewsFromOtherUsers;

  } catch (error) {
    console.log(error);
  }

}

//update a user's name or self-introduction in database
export async function updateUserInDB(accessToken, name, introduction) {
  if (!accessToken) return;

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: name,
        introduction: introduction,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}