const express = require('express');
const router = express.Router();
const { Ward } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');

//Lấy thông tin các xã, phường của 1 quận, huyện
router.get('/:idDistrict', validateToken, async (req, res) => {
  if (!req.query.id) {
    const id_district = req.params.idDistrict;
    if (req.user.role !== 'A1' && id_district.indexOf(req.user.id) !== 0) {
      return res.json('Không có quyền truy cập');
    }
    const listWard = await Ward.findAll({
      where: { id_district: id_district },
      attributes: ['id_ward', 'ward_name', 'quantity_ward', 'hasAccount'],
    });
    res.json(listWard);
  } else {
    const listWard = await Ward.findByPk(req.query.id);
    res.json(listWard);
  }
});


// Them mot xa/phuong moi
router.post("/",validateToken, async (req, res) => {
  if (req.user.role !== 'A3') {
    return res.json('Không có quyền truy cập')
  }

  try {
    const { wardName, wardCode, idDistrict } = req.body;
    Ward.create({
        id_ward: wardCode,
        ward_name: wardName,
        hasAccount: false,
        quantity_ward: 0,
        id_district: idDistrict,
    });
    res.json("SUCCESS");
  } catch(err) {
  }
});

// Khi thay đổi thì sẽ tạo newCode: "value"
// Hàm này có thể update wardCode, wardName, hasAccount, quantity khi có dữ gửi đến (1, 2, hoặc cả 3)
router.post('/:wardId', async (req, res) => {
  const wardId = req.params.wardId;
  // Kiểm tra và sửa đổi id_ward
  if (req.body.newName !== null) {
    const newName = req.body.newName;
    await Ward.update(
      {
        ward_name: newName,
      },
      { where: { id_ward: wardId } }
    );
  }
  if (req.body.newCode !== null) {
    const newCode = req.body.newCode;
    await Ward.update(
      {
        id_ward: newCode,
      },
      { where: { id_ward: wardId } }
    );
  }
  if (req.body.hasAccount !== null) {
    const newHasAccount = req.body.hasAccount;
    await Ward.update(
      {
        hasAccount: newHasAccount,
      },
      { where: { id_ward: wardId } }
    );
  }
  if (req.body.quantity !== null) {
    const quantity = req.body.quantity;
    await Ward.update(
      {
        quantity_ward: quantity,
      },
      { where: { id_ward: wardId } }
    );
  }
  res.json('Update successfully');
});

//Xóa một xa/phuong
router.delete("/:id",validateToken, async (req, res) => {
  if (req.user.role !== 'A3') {
    return res.json('Không có quyền truy cập')
  }
  const id = req.params.id;
  Ward.destroy({
    where: {
      id_ward: id
    } 
  })
  res.send("SUCCESS")
});

module.exports = router;
