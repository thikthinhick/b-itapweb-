const express = require('express');
const router = express.Router();
const {Hamlet} = require('../models')
const { validateToken } = require("../middlewares/AuthMiddleware");

//Lấy thông tin các thôn, xóm của 1 xã, phường
router.get("/:idWard", validateToken, async (req, res) => {
    const id_ward = req.params.idWard
    if (req.user.role !== 'A1' && id_ward.indexOf(req.user.id) !== 0) {
        return res.json('Không có quyền truy cập')
    } 
    const listHamlet = await Hamlet.findAll({
        where: {id_ward : id_ward},
        attributes: ['id_hamlet', 'hamlet_name', 'quantity_hamlet', 'hasAccount']
    });
    res.json(listHamlet);
})


// Them mot thon/khu pho moi
router.post("/",validateToken, async (req, res) => {
    if (req.user.role !== 'B1') {
      return res.json('Không có quyền truy cập')
    } else  {
      try {
        const { hamletName, hamletCode, idWard } = req.body;
        Hamlet.create({
            id_hamlet: hamletCode,
            hamlet_name: hamletName,
            hasAccount: false,
            quantity_hamlet: 0,
            id_ward: idWard,
        });
        res.json("SUCCESS");
      } catch(err) {
        console.log(err)
      }
    }
  });

// Khi thay đổi thì sẽ tạo newCode: "value"
// Hàm này có thể update hamletCode, hamletName, hasAccount, quantity khi có dữ gửi đến (1, 2, hoặc cả 3)
router.post('/:hamletId', async (req, res) => {
    const hamletId = req.params.hamletId;
    // Kiểm tra và sửa đổi id_hamlet
    if (req.body.newName !== null) {
      const newName = req.body.newName;
      await Hamlet.update(
        {
          hamlet_name: newName,
        },
        { where: { id_hamlet: hamletId } }
      );
    }
    if (req.body.newCode !== null) {
      const newCode = req.body.newCode;
      await Hamlet.update(
        {
          id_hamlet: newCode,
        },
        { where: { id_hamlet: hamletId } }
      );
    }
    if (req.body.hasAccount !== null) {
      const newHasAccount = req.body.hasAccount;
      await Hamlet.update(
        {
          hasAccount: newHasAccount,
        },
        { where: { id_hamlet: hamletId } }
      );
    }
    if (req.body.quantity !== null) {
      const quantity = req.body.quantity;
      await Hamlet.update(
        {
          quantity_ward: quantity,
        },
        { where: { id_hamlet: hamletId } }
      );
    }
    res.json('Update successfully');
  });


  //Xóa một xa/phuong
router.delete("/:id",validateToken, async (req, res) => {
    if (req.user.role !== 'B1') {
      return res.json('Không có quyền truy cập')
    }
    const id = req.params.id;
    Hamlet.destroy({
      where: {
        id_hamlet: id
      } 
    })
    res.send("SUCCESS")
  });

module.exports = router;