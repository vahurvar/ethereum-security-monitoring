const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Load mythril model
const Mythril = require('../models/mythril');

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  Mythril.getMythrilInfo(function(err,mythrilinfo){
      if(err){
          res.redirect('/error');
          throw err;
      }
      res.render('dashboard',{todo:mythrilinfo});
  })
);


module.exports = router;
