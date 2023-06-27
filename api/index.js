import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";

const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

//ping pong test
app.get("/ping", (req, res) => {
  res.send("pong");
});

// verify user status, if not registered in our database we will create it
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];

  try {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    if (user) {
      res.status(200).json(user);
      return;
    } else {
      const newUser = await prisma.user.create({
        data: {
          email,
          auth0Id,
        },
      });

      res.status(200).json(newUser);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// get a user
app.get("/user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  try {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// update a user
app.put("/user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const { name, introduction } = req.body;

  try {
    const user = await prisma.user.update({
      where: {
        auth0Id,
      },
      data: {
        name: name,
        selfIntroduction: introduction,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete a user
app.delete("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.delete({
      where: {
        id: parseInt(userId),
      },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// add a movie or update an existing one, return movie id; internal use only
async function addMovie(movieName, tmdbId, posterPath) {
  const existingMovie = await prisma.movie.findUnique({
    where: {
      tmdbId: tmdbId,
    },
  });

  if (existingMovie) {
    updateMovie(tmdbId, movieName, posterPath);
    return existingMovie.id;
  }

  try {
    const movie = await prisma.movie.create({
      data: {
        movieName,
        tmdbId,
        posterPath,
      },
    });
    return movie.id;
  } catch (error) {
    console.log(error);
  }
}

// get the tmdbId of the user's highest rated movie
app.get("/movie/favorite", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  try {

    const userReviews = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
      include: {
        movieReviews: {
          include: {
            movie: true,
          },
        },
      },
    });

    if (!userReviews || userReviews.movieReviews.length === 0) {
      res.status(200).json({tmdbId: null});
      return;
    }

    const highestRatedMovie = userReviews.movieReviews.reduce((prev, curr) =>
      prev.rating > curr.rating ? prev : curr 
    );

    if (!highestRatedMovie) {
      res.status(200).json({tmdbId: null});
    } else {
      res.status(200).json(highestRatedMovie.movie);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// update a movie's movieName and posterPath, internal use only
async function updateMovie(tmdbId, movieName, posterPath) {
  try {
    const movie = await prisma.movie.update({
      where: {
        tmdbId: tmdbId,
      },
      data: {
        movieName,
        posterPath,
      },
    });
    return movie;
  } catch (error) {
    console.log(error);
  }
}

// add an review
app.post("/review", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { tmdbId, posterPath, movieName, content, rating } = req.body;

  const author = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (!author) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const authorId = author.id;
  const movieId = await addMovie(movieName, parseInt(tmdbId), posterPath);

  try {
    const review = await prisma.movieReview.create({
      data: {
        authorId,
        movieId,
        content,
        rating: parseFloat(rating),
      },
    });
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// update a review
app.put("/review", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { tmdbId, posterPath, movieName, content, rating } = req.body;

  const author = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
    include: {
      movieReviews: true,
    },
  });

  if (!author) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const movieId = await addMovie(movieName, parseInt(tmdbId), posterPath);
  const review = author.movieReviews.find(
    (review) => review.movieId === movieId
  );

  if (!review) {
    res.status(404).json({ message: "Review not found" });
    return;
  }

  const reviewId = review.id;

  try {
    const review = await prisma.movieReview.update({
      where: {
        id: reviewId,
      },
      data: {
        content,
        rating: parseFloat(rating),
      },
    });
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete a review
app.delete("/review", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { tmdbId } = req.body;

  const author = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
    include: {
      movieReviews: true,
    },
  });

  if (!author) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const movie = await prisma.movie.findUnique({
    where: {
      tmdbId: parseInt(tmdbId),
    },
  });

  if (!movie) {
    res.status(404).json({ message: "Movie not found" });
    return;
  }

  const movieId = movie.id;

  const review = author.movieReviews.find(
    (review) => review.movieId === movieId
  );

  if (!review) {
    res.status(404).json({ message: "Review not found" });
    return;
  }

  const reviewId = review.id;

  try {
    const review = await prisma.movieReview.delete({
      where: {
        id: reviewId,
      },
    });
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get a user's reveiw of a single movie from database
app.get("/review/:tmdbId", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const tmdbId = req.params.tmdbId;

  try {
    const author = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
      include: {
        movieReviews: true,
      },
    });

    if (!author) {
      res.status(404).json({ message: "user not found" });
      return;
    }

    const movie = await prisma.movie.findUnique({
      where: {
        tmdbId: parseInt(tmdbId),
      },
    });

    if (!movie) {
      res.status(404).json({ message: "movie not found" });
      return;
    }

    const review = author.movieReviews.find(
      (review) => review.movieId === movie.id
    );

    if (!review) {
      res.status(404).json({ message: "review not found" });
      return;
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get the movie name, poster path, rating and tmdb id of all the movies the user has reviewed
app.get("/reviewed-movies", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  try {
    const author = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
      include: {
        movieReviews: {
          include: {
            movie: true,
          },
        },
      },
    });

    if (!author) {
      res.status(404).json({ message: "user not found" });
      return;
    }

    const reviews = author.movieReviews.map((review) => {
      return {
        movieName: review.movie.movieName,
        posterPath: review.movie.posterPath,
        rating: review.rating,
        tmdbId: review.movie.tmdbId,
      };
    });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// get a single movie's reviews from other users
app.get("/other-reviews/:tmdbId", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const tmdbId = req.params.tmdbId;

  try {
    const author = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    if (!author) {
      res.status(404).json({ message: "user not found" });
      return;
    }

    const movie = await prisma.movie.findUnique({
      where: {
        tmdbId: parseInt(tmdbId),
      },
      include: {
        reviews: {
          include: {
            author: true,
          },
        },
      },
    });

    if (!movie) {
      res.status(404).json({ message: "movie not found" });
      return;
    }

    const reviews = movie.reviews.filter(
      (review) => review.authorId !== author.id
    );

    if (reviews.length === 0) {
      res.status(404).json({ message: "no reviews found" });
      return;
    }

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// // get all reviews by authorId
// app.get("/reviews/author/:authorId", async (req, res) => {
//   const { authorId } = req.params;
//   try {
//     const reviews = await prisma.movieReview.findMany({
//       where: {
//         authorId: parseInt(authorId),
//       },
//     });
//     res.status(200).json(reviews);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // get all reviews by movieId
// app.get("/reviews/movie/:movieId", async (req, res) => {
//   const { movieId } = req.params;
//   try {
//     const reviews = await prisma.movieReview.findMany({
//       where: {
//         movieId: parseInt(movieId),
//       },
//     });
//     res.status(200).json(reviews);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // update a review by review id
// app.put("/review/:reviewId", async (req, res) => {
//   const { reviewId } = req.params;
//   const { content, rating } = req.body;
//   try {
//     const review = await prisma.movieReview.update({
//       where: {
//         id: parseInt(reviewId),
//       },
//       data: {
//         content,
//         rating,
//       },
//     });
//     res.status(200).json(review);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // delete a review by review id
// app.delete("/review/:reviewId", async (req, res) => {
//   const { reviewId } = req.params;
//   try {
//     const review = await prisma.movieReview.delete({
//       where: {
//         id: parseInt(reviewId),
//       },
//     });
//     res.status(200).json(review);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

//run the server
app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
