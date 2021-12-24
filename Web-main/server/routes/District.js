const express = require('express');
const router = express.Router();
const {District} = require('../models')
const { validateToken } = require("../middlewares/AuthMiddleware");

//Lấy thông tin các quận, huyện của 1 tỉnh, thành phố
router.get("/:idCity",validateToken, async (req, res) => {
    if (!req.query.id) {
        const id_city = req.params.idCity
        if ( req.user.role !== 'A1' && req.user.id.indexOf(id_city) !== 0) {
            return res.json('Không có quyền truy cập')
        }
        const listDistrict = await District.findAll({
            where: {id_city : id_city},
            attributes: ['id_district', 'district_name', 'quantity_district', 'hasAccount']
        });
        res.json(listDistrict);
    } else {
        const listDistrict = await District.findByPk(req.query.id);
        res.json(listDistrict);
    }
})

//Lấy thông tin 1 quận, huyện
router.get("/id/:id",validateToken, async (req, res) => {
    const id_city = req.query.idDistrict
    console.log(1)
    // if (req.user.role !== 'A1' && req.user.id !== id_city) {
    //     return res.json('Không có quyền truy cập')
    // }
    // const listDistrict = await District.findAll({
    //     where: {id_district : id_district},
    //     attributes: ['id_district', 'district_name', 'quantity_district', 'hasAccount']
    // });
    // res.json(listDistrict);
})


// Them mot quan huyen moi
router.post("/",validateToken, async (req, res) => {
  if (req.user.role !== 'A2') {
    return res.json('Không có quyền truy cập')
  }
  try {
      const { districtName, districtCode, idCity } = req.body;
      District.create({
          id_district: districtCode,
          district_name: districtName,
          hasAccount: false,
          quantity_district: 0,
          id_city: idCity,
      });
      res.json("SUCCESS");
  } catch(err) {
  }
});

// Khi thay đổi thì sẽ tạo newCode: "value"
// Hàm này có thể update districtCode, districtName, hasAccount, quantity khi có dữ gửi đến (1, 2, hoặc cả 3)
    router.post("/:districtId", async (req, res) => {
    const districtId = req.params.districtId; 
    // Kiểm tra và sửa đổi id_district
    if (req.body.newName !== null) {
        const newName = req.body.newName;
        await District.update({
            district_name: newName
        },
        {where: {id_district: districtId}});
    };
    if (req.body.newCode !== null) {
      const newCode = req.body.newCode;
      await District.update({
          id_district: newCode
      },
      {where: {id_district: districtId}});
    };
    if (req.body.hasAccount !== null) {
        const newHasAccount = req.body.hasAccount;
        await District.update({
            hasAccount: newHasAccount
        },
        {where: {id_district: districtId}});
    }
    if (req.body.quantity !== null) {
      const quantity = req.body.quantity;
      await District.update({
          quantity_district: quantity
      },
      {where: {id_district: districtId}});
    }
    res.json("Update successfully");
  });

  //Xóa một quận/huyện
  router.delete("/:id",validateToken, async (req, res) => {
    if (req.user.role !== 'A2') {
      return res.json('Không có quyền truy cập')
    }
    const id = req.params.id;
    District.destroy({
      where: {
        id_district: id
      } 
    })
    res.send("SUCCESS")
  });

module.exports = router;