const express = require("express");
const { connectToDB, getDB } = require("./db");
const { ObjectId } = require("mongodb");

// init app
const app = express();
app.use(express.json());

// db connection
let db;

connectToDB((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("running");
    });

    db = getDB();
  }
});

//routes

app.get("/books", (req, res) => {
  //pagination
  const page = req.query.page || 0;
  const booksPerPage = 3;

  let books = [];

  db.collection("books")
    .find()
    .sort({ author: 1 })
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not find book" });
    });
});

app.get("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({
          error: "Could not fetch docs",
        });
      });
  } else {
    res.status(500).json({
      error: "not valid doc id ",
    });
  }
});

app.post("/books", (req, res) => {
  const book = req.body;
  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        err: "Could not create book",
      });
    });
});

app.delete("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({
          error: "Could not delete docs",
        });
      });
  } else {
    res.status(500).json({
      error: "not valid doc id ",
    });
  }
});

app.patch("/books/:id", (req, res) => {
  const updates = req.body;

  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({
          error: "Could not update doc",
        });
      });
  } else {
    res.status(500).json({
      error: "not valid doc id ",
    });
  }
});
