import * as dotenv from 'dotenv'
dotenv.config()
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from  'express-oauth2-jwt-bearer'

const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: 'RS256'
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
    res.status(500).json({ error: error.message});
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
    res.status(500).json({ error: error.message});
  }
});

// update a user
app.put("/user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const { name, introduction } = req.body;

  console.log(auth0Id, name, introduction);

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
    res.status(500).json({ error: error.message});
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
    res.status(500).json({ error: error.message});
  }
});


// add a movie
app.post("/movie", async (req, res) => {
  const { movieName, tmdbId, posterPath } = req.body;

  try {
    const movie = await prisma.movie.create({
      data: {
        movieName,
        tmdbId,
        posterPath,
      },
    });
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
});

// get a movie by tmdbId
app.get("/movie/:tmdbId", async (req, res) => {
  const { tmdbId } = req.params;
  try {
    const movie = await prisma.movie.findUnique({
      where: {
        tmdbId: parseInt(tmdbId),
      },
    });
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
});

// update a movie's posterPath
app.put("/movie/:tmdbId", async (req, res) => {
  const { tmdbId } = req.params;
  const { posterPath } = req.body;
  try {
    const movie = await prisma.movie.update({
      where: {
        tmdbId: parseInt(tmdbId),
      },
      data: {
        posterPath,
      },
    });
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
});

// delete a movie
app.delete("/movie/:tmdbId", async (req, res) => {
  const { tmdbId } = req.params;
  try {
    const movie = await prisma.movie.delete({
      where: {
        tmdbId: parseInt(tmdbId),
      },
    });
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
});

// add an review
app.post("/review", async (req, res) => {
  const { authorId, tmdbId, content, rating } = req.body;

  const movie = await prisma.movie.findUnique({
    where: {
      tmdbId,
    },
  });

  const author = await prisma.user.findUnique({
    where: {
      id: authorId,
    },
  });

  if (!movie || !author) {
    res.status(404).json({ error: "movie or author not found" });
    return;
  }
  
  try {
    console.log(authorId);
    console.log(movie.id);
    const review = await prisma.movieReview.create({
      data: {
        authorId,
        movieId: movie.id,
        content,
        rating,
      },
    });
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message});
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
      res.status(404);
      return;
    }

    const movie = await prisma.movie.findUnique({
      where: {
        tmdbId: parseInt(tmdbId),
      },
    });

    if (!movie) {
      res.status(404);
      return;
    }

    const review = author.movieReviews.find((review) => review.movieId === movie.id);

    res.status(200).json(review);

  } catch (error) {
    res.status(500).json({ error: error.message});
  }
});

// get a single movie's reviews from other users
app.get("/reviews/:tmdbId", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const tmdbId = req.params.tmdbId;

  try {
    const author = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    if (!author) {
      res.status(404);
      return;
    }

    const movie = await prisma.movie.findUnique({
      where: {
        tmdbId: parseInt(tmdbId),
      },
      include: {
        reviews:{
          include: {
            author: true,
          },
        },
      },
    });

    if (!movie) {
      res.status(404);
      return;
    }

    const reviews = movie.reviews.filter((review) => review.authorId !== author.id);

    res.status(200).json(reviews);

  } catch (error) {
    res.status(500).json({ error: error.message});
  }

});

  // get all reviews by authorId
  app.get("/reviews/author/:authorId", async (req, res) => {
    const { authorId } = req.params;
    try {
      const reviews = await prisma.movieReview.findMany({
        where: {
          authorId: parseInt(authorId),
        },
      });
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message});
    }
  });

  // get all reviews by movieId
  app.get("/reviews/movie/:movieId", async (req, res) => {
    const { movieId } = req.params;
    try {
      const reviews = await prisma.movieReview.findMany({
        where: {
          movieId: parseInt(movieId),
        },
      });
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message});
    }
  });


// update a review by review id
app.put("/review/:reviewId", async (req, res) => {
  const { reviewId } = req.params;
  const { content, rating } = req.body;
  try {
    const review = await prisma.movieReview.update({
      where: {
        id: parseInt(reviewId),
      },
      data: {
        content,
        rating,
      },
    });
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
});

// delete a review by review id
app.delete("/review/:reviewId", async (req, res) => {
  const { reviewId } = req.params;
  try {
    const review = await prisma.movieReview.delete({
      where: {
        id: parseInt(reviewId),
      },
    });
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
});

//run the server
app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
