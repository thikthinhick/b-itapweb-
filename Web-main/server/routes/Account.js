const express = require('express');
const router = express.Router();
const { Account } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateToken } = require("../middlewares/AuthMiddleware");

// router.get('/' ,async (req, res) => {
//   bcrypt.hash('password', 10).then((hash) => {
//     Account.create({
//       username: '01010101',
//       password: hash,
//       role: 'B2'
//     });
//     res.json('SUCCESS');
//   });
// });

router.get('/update/:id', validateToken ,async (req, res) => {
  const id = req.params.id;
  bcrypt.hash(id, 10).then((hash) => {
    Account.update(
      {
        password: hash,
      },
      { where: { username: id } }
    );
  });
});

// Cấp tài khoản 
router.post("/", validateToken,async (req, res) => {
    const { username, password } = req.body;
    let role = ''
    const roleAuth = req.user.role;
    if (roleAuth === 'A1') role = 'A2'
    else if (roleAuth === 'A2') role = 'A3'
    else if (roleAuth === 'A3') role = 'B1'
    else role = 'B2'
    
    bcrypt.hash(password, 10).then((hash) => {
      Account.create({
        username: username,
        password: hash,
        role: role
      });
      // res.json("SUCCESS");
    });
    res.json('SUCCESS');
  });

// Xác thực thông tin đăng nhập
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await Account.findOne({where: {username: username}});
  if (!user) res.json({ error: "Tài khoản không tồn tại" });
  console.log(user.password)
  bcrypt.compare(password, user.password).then((match) => {
    // console.log(match)
    // if (!match) res.json({ error: 'Mật khẩu không chính xác' });
    // else {
      const accessToken = jwt.sign({ id: user.username, role: user.role }, "importantsecret", {
        expiresIn: "24h",
      });
      res.cookie('token', accessToken)
      res.json({ username: user.username, role: user.role, accessToken });
    // }
  });
});

// Xóa 1 tài khoản
router.delete("/:username", validateToken, async (req, res) => {
  const username = req.params.username;
  Account.destroy({
    where: {
      username: username
    } 
  })
  res.send("SUCCESS")
});

module.exports = router;
