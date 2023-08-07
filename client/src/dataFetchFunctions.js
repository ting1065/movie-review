const tmdbToken = process.env.TMDB_TOKEN;

//extract a brief json from a single movie's json from tmdb api
function extractMovieDataBrief(movie) {
  return {
    tmdbId: movie.id,
    title: movie.title,
    posterPath: movie.poster_path,
    rating: movie.vote_average,
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

//get recommended movies from tmdb api using tmdb id
export async function getRecommendedMovies(tmdbId) {
  if (!tmdbId) return;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}/recommendations?language=en-US&page=1`,
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

//get searched movies using searched name from tmdb api
export async function getSearchedMovies(searchedName) {
  if (!searchedName) return;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${searchedName}&include_adult=false&language=en-US&page=1`,
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
  if (!tmdbId) return;

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
  if (!tmdbId) return;

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
    const reviewsFromTmdb = data.results.map((review) =>
      extractReviewData(review)
    );

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

    if (response.status === 204) {
      const { message } = await response.json();
      console.log(message);
      return;
    } else if (!response.ok) {
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

    if (response.status === 204) {
      const { message } = await response.json();
      console.log(message);
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
      `${process.env.REACT_APP_API_URL}/other-reviews/${tmdbId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.status === 204) {
      const { message } = await response.json();
      console.log(message);
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

// get the movie name, poster path, rating and tmdb id of all the movies the user has reviewed
export async function getReviewedMoviesFromDB(accessToken) {
  if (!accessToken) return;
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/reviewed-movies`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 204) {
      const { message } = await response.json();
      console.log(message);
      return;
    } else if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const reviewedMoviesFromDB = await response.json();
    return reviewedMoviesFromDB;
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

    if (response.status === 204) {
      const { message } = await response.json();
      console.log(message);
      return;
    } else if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
}

//add a new review to database
export async function addReviewToDB(
  accessToken,
  tmdbId,
  posterPath,
  movieName,
  content,
  rating
) {
  if (!accessToken) return;
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        tmdbId: tmdbId,
        posterPath: posterPath,
        movieName: movieName,
        content: content,
        rating: rating,
      }),
    });

    if (response.status === 204) {
      const { message } = await response.json();
      console.log(message);
      return;
    } else if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const newReview = await response.json();
    return newReview;
  } catch (error) {
    console.log(error);
  }
}

//update a review in database
export async function updateReviewInDB(
  accessToken,
  tmdbId,
  posterPath,
  movieName,
  content,
  rating
) {
  if (!accessToken) return;
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/review`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        tmdbId: tmdbId,
        posterPath: posterPath,
        movieName: movieName,
        content: content,
        rating: rating,
      }),
    });

    if (response.status === 204) {
      const { message } = await response.json();
      console.log(message);
      return;
    } else if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const updatedReview = await response.json();
    return updatedReview;
  } catch (error) {
    console.log(error);
  }
}

//delete a review from database
export async function deleteReviewFromDB(accessToken, tmdbId) {
  if (!accessToken) return;
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/review`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        tmdbId: tmdbId,
      }),
    });

    if (response.status === 204) {
      const { message } = await response.json();
      console.log(message);
      return;
    } else if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const deletedReview = await response.json();
    return deletedReview;
  } catch (error) {
    console.log(error);
  }
}

//get the user's highest rated movie's tmdbId from database
export async function getHighestRatedMovieFromDB(accessToken) {
  if (!accessToken) return;

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/movie/favorite`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 204) {
      const { message } = await response.json();
      console.log(message);
      return;
    } else if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const highestRatedMovie = await response.json();
    return highestRatedMovie;
  } catch (error) {
    console.log(error);
  }
}
