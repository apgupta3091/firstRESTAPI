const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const e = require("express");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("articles", articleSchema);

//////////////////APP ROUTE FOR ALL ARTICLES////
app
  .route("/articles")

  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send("successfully added new article");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("successfully deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

//////////////////APP ROUTE FOR SPECIFIC ARTICLES////

app
  .route("/articles/:articleTitle")

  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No articles found matching that title.");
        }
      }
    );
  })

  .put(function (req, res) {
    Article.replaceOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      function (err) {
        if (!err) {
          res.send("success updated article");
        }
      }
    );
  })

  .patch(function (req, res) {
    Article.updateOne(
      { title: req.params.articleTitle },
      req.body,
      function (err) {
        if (!err) {
          res.send(
            "Successfully updated certain content of the selected article."
          );
        }
      }
    );
  })

  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (!err) {
        res.send("Successfully delete certain article");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("server listening on port 3000");
});
