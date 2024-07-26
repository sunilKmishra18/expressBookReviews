const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userExist = users.filter((user) => {
        return user.username === username;
      });
      if (userExist.length > 0) {
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return user.username === username && user.password === password;
      });
      if (validusers.length > 0) {
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
        {
          data: password,
        },
        "access",
        { expiresIn: 60 * 60 }
      );
  
      req.session.authorization = {
        accessToken,
        username,
      };
      return res.status(200).send("Customer successfully logged in");
    } else {
      return res
        .status(208)
        .json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let username = req.session.authorization["username"];
  let isbn = req.params.isbn;
  let findUser = users[username];
  let findBook = books[isbn];
  if (findUser) {
    findBook["review"] = req.body.review;
    res.send(`Book with the isbn  ${isbn} updated.`);
  } else {
    findBook.push({ review: review });
    res.send(`Book with the isbn new ${isbn} updated.`);
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
