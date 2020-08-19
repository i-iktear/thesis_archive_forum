const express = require("express");
const Paper = require("../models/paper");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

router.get("/", forwardAuthenticated, (req, res) => res.render("register"));

router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  const papers = await Paper.find().sort({
    createdAt: "desc",
  });
  res.render("../views/dashboard.ejs", {
    user: req.user,
    papers: papers,
  });
});

module.exports = router;
