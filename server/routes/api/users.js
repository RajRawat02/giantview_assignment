const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');
const Student=  mongoose.model('Student');
//POST new user route (optional, everyone has access)
router.post('/register', auth.optional, async(req, res, next) => {

  console.log("#################",req);
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }
  let isUser = await Users.findOne({email:user.email});
  if(isUser){
    return res.status(400).send('That user already exists!');
  }
  else{
    console.log("user&&&&&&&&&&",user);
    const finalUser = new Users(user);
  
    finalUser.setPassword(user.password);
  
    return finalUser.save()
      .then(() => res.json({ user: finalUser.toAuthJSON() }));
  }
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
  console.log("%%%%%%%%%%%%%%%%%");
  const { body: { user } } = req;

  if(!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if(!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if(err) {
      return next(err);
    }
    console.log("passportUser passportUser"+passportUser);
    if(passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();

      return res.json({ user: user.toAuthJSON() });
    }

    return status(400).info;
  })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
  const { payload: { id } } = req;

  return Users.findById(id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }

      return res.json({ user: user.toAuthJSON() });
    });
});

//Get students
router.get('/student', auth.optional, (req, res, next) => {
  //const { payload: { id } } = req;

  return Student.find({})
    .then((students) => {
      if(!students) {
        return res.sendStatus(400);
      }

      return res.send(students);
    });
});

router.post('/addstudent', auth.optional, (req, res, next) => {
  const student = new Student({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    rollno: req.body.rollno,
    degree: req.body.degree,
    city: req.body.city,
  });
  return student
    .save()
    .then((newStudent) => {
      return res.status(201).json({
        success: true,
        message: 'New student created successfully',
        student: newStudent,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: error.message,
      });
    });
});


router.patch('/addstudent/:studentId', auth.optional, (req, res, next) => {
  const id = req.params.studentId;
  const updateObject = req.body;
  Student.update({ _id:id }, { $set:updateObject })
    .exec()
    .then(() => {
      res.status(200).json({
        success: true,
        message: 'student is updated',
        updateCause: updateObject,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.'
      });
    });
});

module.exports = router;