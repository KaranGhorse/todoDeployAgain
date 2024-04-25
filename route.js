require("dotenv").config();
var express = require("express");
var router = express.Router();
const userModel = require("./userModel");
const todoModel = require("./todoModel");
const jwt = require("jsonwebtoken");

router
  .route("/register")
  .get((req, res, next) => {
    res.render("register");
  })
  .post(async function (req, res, next) {
    try {
      const { username, email, fullname, password } = req.body;
      const userData = new userModel({
        username,
        email,
        fullname,
        password,
      });

      const user = await userData.save();
      console.log(user);
      res.redirect("/todo");
    } catch (err) {
      console.log(err);
      res.redirect("/");
    }
  });

router
  .route("/")
  .get(function (req, res, next) {
    res.render("index");
  })
  .post(async function (req, res) {
    try {
      const { username, password } = req.body;
      const user = await userModel.findOne({ username });
      if (user) {
        if (user.password == password) {
          const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: "1d",
          });

          // Send token in response
          res.cookie("Token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
          });
          console.log("cookies sending on front");

          res.redirect("/todo");
        }
      } else {
        res.redirect("/");
      }
    } catch (err) {
      console.log(err);
      res.redirect("/");
    }
  });

router
  .route("/todo")
  .get(isLoggedIn, async (req, res, next) => {
    try {
      const token = req.cookies["Token"];
      const user = await userModel.findById(verifyToken(token));

      const todo = await todoModel.find({
        userid: user._id,
      });

      res.render("todo", { user, todo });
    } catch (err) {
      console.log(err);
      res.redirect("/");
    }
  })
  .post(isLoggedIn, async (req, res) => {
    try {
      const token = req.cookies["Token"];
      const user = await userModel.findById(verifyToken(token));
      const todo = new todoModel({
        username: user.username,
        userid: user._id,
        title: req.body.work,
        work: req.body.desc,
      });

      const data = await todo.save();
      user.todo.push(data._id);
      res.redirect("/todo");

    } catch (err) {
      console.log(err);
      res.redirect("/todo");
    }
  });

router.route("/todo/comp/:id").get(isLoggedIn, async function (req, res) {
  try {
    console.log(req.params);
    const todo = await todoModel.findById({ _id: req.params.id });

    todo.complete = true;
    console.log(todo);
    await todo.save();
    res.redirect("/todo");
  } catch (err) {
    console.log(err);
    res.redirect('/todo')
  }
});

router.get("/todo/del/:id", async (req, res) => {
  try {
    const todo = await todoModel.findByIdAndDelete(req.params.id);
    res.redirect("/todo");
  } catch (err) {
    console.log(err);
    res.redirect('/tood')
  }
});


function verifyToken(token) {
  // const token = req.cookies['authAdToken'];
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const userId = decoded.userId;
  return userId;
}

router.get("/logout", (req, res) => {
  res.clearCookie("Token"); // Cookie ka naam jo aapne set kiya hai use yahaan specify karein
  res.redirect("/"); // Logout ke baad user ko kisi specific page par redirect kar sakte hain
});

function isLoggedIn(req, res, next) {
  console.log("so i am in isLoggedIn middilware");
  const token = req.cookies["Token"];
  if (!token) {
    res.redirect("/");
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      res.redirect("/");
    }
    req.user = decoded;
    next();
  });
}

module.exports = router;
