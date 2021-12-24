const express = require('express');
const router = express.Router();
const {City} = require('../models')
const { validateToken } = require("../middlewares/AuthMiddleware");
const db = require("../models");

// Lấy thông tin tất cả thành phố 
router.get("/",validateToken, async (req, res) => {
  if (req.user.role !== 'A1') {
    return res.json('Không có quyền truy cập')
  }
    const listCity = await City.findAll();
    res.json(listCity);
})

//Lấy thông tin một thành phố
router.get("/:id",validateToken, async (req, res) => {
  console.log(req.params.id)
  const cityId = req.params.id; 
  if (req.user.role !== 'A1' && req.user.id.indexOf(cityId) !== 0) {
    return res.json('Không có quyền truy cập')
  }
    const listCity = await City.findByPk(cityId);
    res.json(listCity);
})

// Them moi mot thanh pho
router.post("/",validateToken, async (req, res) => {
  if (req.user.role !== 'A1') {
    res.json('Không có quyền truy cập')
  } else {
    try {
      const { cityName, cityCode } = req.body;
      await City.create({
          id_city: cityCode,
          city_name: cityName,
          hasAccount: false,
          quantity_city: 0
      });
      res.json("SUCCESS");
    } catch(e) {
      console.log(e)
    }
  }
  });


// Khi thay đổi thì sẽ tạo newCode: "value"
// Hàm này có thể update cityCode, cityName, hasAccount khi có dữ gửi đến (1, 2, hoặc cả 3)
router.post("/:cityId",validateToken, async (req, res) => {
  if (req.user.role !== 'A1') {
    return res.json('Không có quyền truy cập')
  }
    const cityId = req.params.cityId; 
    // Kiểm tra và sửa đổi id_city
    if (req.body.newName !== null) {
        const newName = req.body.newName;
        await City.update({
            city_name: newName
        },
        {where: {id_city: cityId}});
    };
    if (req.body.newCode !== null) {
      const newCode = req.body.newCode;
      await City.update({
          id_city: newCode
      },
      {where: {id_city: cityId}});
    };
    if (req.body.hasAccount !== null) {
        const newHasAccount = req.body.hasAccount;
        await City.update({
            hasAccount: newHasAccount
        },
        {where: {id_city: cityId}});
    }
    if (req.body.quantity !== null) {
      const quantity = req.body.quantity;
      await City.update({
          quantity_city: quantity
      },
      {where: {id_city: cityId}});
    }
    res.json("Update successfully");
  });

//Xóa một thành phố
  router.delete("/:id",validateToken, async (req, res) => {
    if (req.user.role !== 'A1') {
      return res.json('Không có quyền truy cập')
    }
    const id = req.params.id;
    City.destroy({
      where: {
        id_city: id
      } 
    })
    res.send("SUCCESS")
  });

  router.put("/:id", validateToken, async (req, res) => {
    if (req.user.role !== 'A1') {
      return res.json('Không có quyền truy cập')
    }
    const id = req.params.id;
    await City.update({
      canDeclare: false
    },
    {where: {id_city: id}})
  })

module.exports = router;