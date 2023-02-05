const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const {
  chkmail,
  chkpair,
  getNameByMail,
  createUser
} = require('../models/database');
// *********************************************************
// GET ROUTES
router.get('/', (req, res) => {
  if (req.session.showname) {
    return res.redirect('/member');
  } else {
    return res.render('home');
  }
});

router.get('/member', (req, res) => {
  if (req.session.showname) {
    const memberName = req.session.showname;
    res.render('member', { memberName });
  } else {
    return res.redirect('/');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  return res.redirect('/');
});

// *********************************************************
// Sign-In POST ROUTE
router.post('/signin', async (req, res) => {
  const { oldemail, oldpwd } = req.body;
  const getmail = await chkmail(oldemail);
  const getpair = await chkpair(oldemail, oldpwd);

  if (getpair) {
    const nameobj = await getNameByMail(oldemail);
    req.session.showname = nameobj.name;
    return res.send("/member");
  } else {
    let text;
    if (!oldemail.trim() || !oldpwd.trim()) {
      text = "E-mail and Password cannot be blank.";
    } else if (getmail === undefined) {
      text = "Your email has not been registered. Please click SignUp.";
    } else if (getpair === undefined || getpair === false) {
      text = "Your email and password do not match.";
    }
    return res.json({ msg: [text] });
  }
});

// *********************************************************
// Sign-Up POST ROUTE
router.post('/signup', [
  // input validation rules
  body('newname')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Name is required.'),
  body('newemail')
    .trim()
    .isEmail()
    .withMessage('Email is not valid.')
    .normalizeEmail(),
  body('newpwd')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password should be 8-16 characters long.')
    .custom((value) => {
      const pwdregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
      if (!value.match(pwdregex)) {
        throw new Error('Password should have at least one digit, one lowercase letter, one uppercase letter.');
      }
      return true;
    }),
  body('newpconf')
    .custom((value, { req }) => {
      if (value !== req.body.newpwd) {
        throw new Error('Passwords do not match.');
      }
      return true;
    })
  // check if input pass validation
], (req, res, next) => {
  const err = validationResult(req).formatWith(({ msg }) => msg);
  if (!err.isEmpty()) {
    res.json({ msg: err.array() });
  } else {
    next();
  }
  // no issue with input data, creating new record in db
}, async function (req, res) {
  const { newname, newemail, newpwd } = req.body;
  const getmail = await chkmail(newemail);
  if (!getmail) {
    const newRec = await createUser(newname, newemail, newpwd);
    req.session.showname = newRec.name;
    return res.send("/member");
  } else {
    return res.json({ msg: ["Your email has been registered. Please click SignIn."] });
  }
}
);

module.exports = router;
