const express = require('express');
const router = express.Router();
const {City} = require('../models');
const {Task} = require('../models');
const db = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");


//Lấy thông tin tình hình nhập liệu của các tỉnh, thành phố
router.get("/city", validateToken,async (req, res) => {   
    if (req.user.role !== 'A1') {
        return res.json('Không có quyền truy cập')
    }
    const [result, metadata] = await db.sequelize.query(`select cities.city_name as cityName, cities.id_city as id, 
    tasks.start_date as startDate, tasks.end_date as endDate,  ifnull(tasks.is_finished,0) as status, cities.canDeclare, cities.quantity_city as progress
    from cities left JOIN tasks on cities.id_city = tasks.id_task`)
    res.json(result);
})

//Lấy thông tin tình hình nhập liệu của các quận, huyện
router.get("/district", validateToken,async (req, res) => {
    if (req.user.role !== 'A2') {
        return res.json('Không có quyền truy cập')
    }
    const [result, metadata] = await db.sequelize.query(`select districts.district_name as cityName, districts.id_district as id, 
    tasks.start_date as startDate, tasks.end_date as endDate,  ifnull(tasks.is_finished,0) as status, districts.quantity_district as progress
    from districts left JOIN tasks on districts.id_district = tasks.id_task
    where districts.id_city = ${req.user.id}`)
    res.json(result);
})

//Lấy thông tin tình hình nhập liệu của các xã, phường
router.get("/ward", validateToken,async (req, res) => {
    if (req.user.role !== 'A3') {
        return res.json('Không có quyền truy cập')
    }
    const [result, metadata] = await db.sequelize.query(`select wards.ward_name as cityName, wards.id_ward as id, 
    tasks.start_date as startDate, tasks.end_date as endDate,  ifnull(tasks.is_finished,0) as status, wards.quantity_ward as progress
    from wards left JOIN tasks on wards.id_ward = tasks.id_task
    where wards.id_district = ${req.user.id}`)
    res.json(result);
})

//Lấy thông tin tình hình nhập liệu của các thôn, xóm
router.get("/hamlet", validateToken,async (req, res) => {
    if (req.user.role !== 'B1') {
        return res.json('Không có quyền truy cập')
    }
    const [result, metadata] = await db.sequelize.query(`select hamlets.hamlet_name as cityName, hamlets.id_hamlet as id, 
    tasks.start_date as startDate, tasks.end_date as endDate,  ifnull(tasks.is_finished,0) as status, hamlets.quantity_hamlet as progress
    from hamlets left JOIN tasks on hamlets.id_hamlet = tasks.id_task
    where hamlets.id_ward = ${req.user.id}`)
    res.json(result);
})

router.get("/:id", validateToken,async (req, res) => {    
    const id = req.params.id
    const result = await Task.findByPk(id)
    res.json(result);
})

router.put("/complete", validateToken,async (req, res) => {    
    const id = req.user.id
    const task = await Task.findByPk(id)
    await Task.update({
        is_finished: !task.is_finished
    },
    {where: {id_task: id}});
    const checkDis = await Task.findOne({
        where: {owner_id : id.substr(0,4), is_finished: false}
    })
    if (!checkDis) {
        await Task.update({
            is_finished: true
        },
        {where: {id_task: id.substr(0,4)}});
        const checkCity = await Task.findOne({
            where: {owner_id : id.substr(0,2), is_finished: false}
        })
        if (!checkCity) {
            await Task.update({
                is_finished: true
            },
            {where: {id_task: id.substr(0,2)}});
        }
    }
})

//Cấp và mở quyền khai báo (thời điểm bắt đầu và kết thúc) cho 1 tỉnh thành phố
router.put("/:id", validateToken,async (req, res) => {
    // if (req.user.role !== 'A1') {
    //     return res.json('Không có quyền truy cập')
    // }
    const time = req.body
    const id = req.params.id
    const task = await Task.findByPk(id)
    if (task) {
        await Task.update({
            start_date: time.startDate,
            end_date: time.endDate,
        },
        {where: {id_task: id}});
    } else {
        await Task.create({
            id_task: id,
            start_date: time.startDate,
            end_date: time.endDate,
            is_finished: false,
            owner_id: (id.length === 2) ? '00' : id.substr(0, id.length - 2),
            lower_grade_id: 0,
        });
    }
    res.json(time);
})

module.exports = router;