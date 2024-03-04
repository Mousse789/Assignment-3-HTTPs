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

// POST /to retrieve who has taken the courses you have taken except CS548. 
studentInfo.post('/course-mates', getLocation, (req, res) => {
    const {student_id} = req.body;

    if (!student_id) {
        return res.status(200).json({message: "Please provide a valid student ID."})
    }

    const myStudentObject = data.find(student => student['student_id'] === student_id)
    if (!myStudentObject) {
        return res.status(404).json({message: "Student ID not found."})
    }

    const myCourses = myStudentObject.courses
                         .filter(course => course.course_id !== 'CS548')
                         .map(course => ({ id: course.course_id, name: course.course_name }))

    const courseMates = data.reduce((acc, student) => {
        if (student.student_id !== student_id) {
            const sharedCourses = student.courses.filter(sc =>
                myCourses.some(mc => mc.id === sc.course_id)
            ).map(course => ({ id: course.course_id, name: course.course_name }))

            if (sharedCourses.length > 0) {
                acc.push({
                    studentId: student.student_id,
                    sharedCourses: sharedCourses
                })
            }
        }
        return acc;
    }, [])

    const response = {
        deviceAndIPAddress: {
            ip: req.userIp,
            device: req.userDevice
        },
        courseMates
    }
    res.json(response)
})

module.exports = studentInfo