const express = require('express');
const Paper = require('../models/paper');
const { findById } = require('../models/paper');
const User = require('../models/User');
const router = express.Router();
const { ensureAuthenticated, canEditPaper } = require('../config/auth');

router.get('/new', ensureAuthenticated, (req, res) => {
  res.render('papers/new', { user: req.user, paper: new Paper() });
});

//Showing mypapers 
router.get('/mypapers', ensureAuthenticated, async (req, res) => {
  const papers = await Paper.find().sort({
    createdAt: 'desc',
  });
  res.render('../views/mypaper.ejs', {
    user: req.user,
    papers: papers,
  });
});

//editing in Mypapers
router.get('/mypapers/edit/:id', ensureAuthenticated, async (req, res) => {
  const paper = await Paper.findById(req.params.id);
  res.render('papers/edit', { user: req.user, paper: paper });
});


//editing in homepage
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  const paper = await Paper.findById(req.params.id);
  res.render('papers/edit', { user: req.user, paper: paper });
});

//showing paper with tittle in link
router.get('/:slug', async (req, res) => {
  const paper = await Paper.findOne({ slug: req.params.slug });
  if (paper == null) res.redirect('/dashboard');
  res.render('papers/show', { user: req.user, paper: paper });
});


router.get('/papers/:slug', async (req, res) => {
  const paper = await Paper.findOne({ slug: req.params.slug });
  if (paper == null) res.redirect('/dashboard');
  res.render('papers/show', { user: req.user, paper: paper });
});

//showing paper with tittle in link in Mypapers
router.get('/papers/mypapers/:slug', async (req, res) => {
  const paper = await Paper.findOne({ slug: req.params.slug });
  if (paper == null) res.redirect('/dashboard');
  res.render('papers/show', { user: req.user, paper: paper });
});


//adding paper
router.post(
  '/',
  async (req, res, next) => {
    req.paper = new Paper();
    next();
  },
  savePaperAndRedirect('new')
);

//editing in Mypaper
router.put(
  '/:id',
  async (req, res, next) => {
    req.paper = await Paper.findByIdAndUpdate(req.params.id);
    next();
  },
  savePaperAndRedirect('edit')
);
//deleting paper
router.delete('/:id', async (req, res) => {
  await Paper.findByIdAndDelete(req.params.id);
  res.redirect('/dashboard');
});

//delete from mypapers
router.delete("/mypapers/:id", async (req, res) => {
  await Paper.findByIdAndDelete(req.params.id);
  res.redirect("/papers/mypapers");
});

//savepaperfunction
function savePaperAndRedirect(path) {
  return async (req, res) => {
    let paper = req.paper;
    paper.title = req.body.title;
    paper.author = req.body.author;
    paper.session = req.body.session;
    paper.userID = req.body.userID;
    paper.categories = req.body.categories;
    paper.status = req.body.status;
    paper.abstract = req.body.abstract;
    paper.linkpdf = req.body.linkpdf;
    try {
      paper = await paper.save();
      req.flash('success_msg', 'Paper Saved!! you  can See here now');
      res.redirect(`/papers/${paper.slug}`);
    } catch (error) {
      console.log(error);
      res.render(`papers/ ${path}`, { paper: paper });
    }
  };
}


//searchg paper route

router.post('/search', async (req, res) => {
  const { searchText } = req.body;
  try {
    const papers = await Paper.find({
      $or: [
        { title: { $regex: searchText, $options: 'i' } },
        { author: { $regex: searchText, $options: 'i' } },
        { categories: { $regex: searchText, $options: 'i' } },
        { session: { $regex: searchText, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });

    res.render('../views/dashboard.ejs', {
      user: req.user,
      papers: papers,
    });
  } catch (error) {
    console.log('search error : ', error);
  }
});

module.exports = router;
