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

// POST /to retrieve student's info who has taken CS548 -> the result should be all students ( return student-id only)
studentInfo.post('/student-cs548', getLocation, (req, res) => {
    const {course} = req.body

    if(!course){
        res.status(200).json({message: "The course you've provided does not exist. Please try again."})
    }

    const studentsTakenCS548 = data.filter(student => 
        student.courses.some(courseObject => courseObject.course_id === course)
    )

    const students = studentsTakenCS548.map(student => student.student_id)
    
    const response = {
        deviceAndIPAddress: {
            ip: req.userIp,
            device: req.userDevice
        },
        studentsTakenCS548: {
            students
        }
    }
    res.json(response)
})

module.exports = studentInfo