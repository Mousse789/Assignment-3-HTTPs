const express = require('express')
const data = require('../database/2024-spring-student-info.json')
const studentInfo = express.Router()

studentInfo.use(express.json());

console.log(data, "this is our data")

// Check/Return user device and IP Address
function getLocation(req, res, next) {
    req.userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    req.userDevice = req.header('User-Agent')

    next();
}

// POST /to retrieve your information based on 'student-id'
studentInfo.post('/my-student-info', getLocation, (req, res) => {
    const {student_id} = req.body

    if(!student_id){
        return res.status(400).json({message: "Student ID was not found. Please check to make sure you've entered a valid ID number."})
    }

    const studentObject = data.find(s => s['student_id'] === student_id)

    const response = {
        deviceAndIPAddress: {
            ip: req.userIp,
            device: req.userDevice
        },
        myStudentInfo: {
            studentObject
        }
    }
    res.json(response)
})

module.exports = studentInfo