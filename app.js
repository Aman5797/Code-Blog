const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const lodash = require("lodash");

const app = express();

mongoose.connect(
  "mongodb+srv://<user-name>:<password>@cluster0.ir7gf.mongodb.net/blogDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const postSchema = mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model("Post", postSchema);

const post1 = new Post({
  title: "Python",
  content:
    "Future of python developers is so bright that every other delopment stream will be in shadow.",
});
//post1.save();

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    if (!err) {
      console.log(posts);
      res.render("home", {
        posts: posts,
      });
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about", {});
});

app.get("/contact", function (req, res) {
  res.render("contact", {});
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/posts/:param", function (req, res) {
  Post.find({}, function (err, posts) {
    if (!err) {
      posts.forEach(function (post) {
        if (req.params.param == post._id) {
          console.log(req.params.param + "||");
          console.log(post._id + "||");
          console.log("Matched");
          res.render("post", { title: post.title, content: post.content });
        }
      });
    } else {
      console.log("Error:65");
    }
  });

  console.log(req.params.param);
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  post.save();
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
