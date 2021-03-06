const bcrypt = require('bcryptjs');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

const rounds = process.env.ROUNDS || 4;
const Users = require('./users-model.js');
const secret = require('./secret.js').jwtSecret;

router.post('/register', (req, res) => {
  // implement registration
  const userInfo = req.body;
  if(!userInfo.username || !userInfo.password) {
    res.status(400).json({ message: 'Please provide username and password to register'});
  } else {
    const hash = bcrypt.hashSync(userInfo.password, rounds);
    userInfo.password = hash;
    Users.add(userInfo)
      .then(user => {
        res.status(200).json({message: 'Registration successful', username: user.username});
      })
      .catch(err => res.status(500).json(err));
  }
  
});

router.post('/login', (req, res) => {
  // implement login
  const {username, password} = req.body;
  if(!username || !password) {
    res.status(400).json({ message: 'Please provide username and password to login'});
  } else {
    Users.findBy({username})
      .then(user => {
        if(user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({message: 'Login Successful', token});
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(err => res.status(500).json(err));
  }
});

function generateToken(user) {
  const payload = {
    username: user.username
  };
  const options = {
    expiresIn: '1 day'
  };

  return jwt.sign(payload, secret, options);
}
module.exports = router;
