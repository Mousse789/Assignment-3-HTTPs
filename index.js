const express = require('express')
const https = require('https')
const fs = require('fs')
const path = require('path')
const studentInfo = require('./routes/studentInfo')
const mystudentInfo = require('./routes/mystudentinfo')
const studentTakenCS548 = require('./routes/student_taken_cs548')
const specificCourseSearch = require('./routes/specific_course_search')

const app = express()

const keyPath = path.join(__dirname, 'ssl', 'key.key');
const certPath = path.join(__dirname, 'ssl', 'cert.pem');
const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
};

const server = https.createServer(httpsOptions, app)
app.use(express.json())
app.use('/web-https', studentInfo)
app.use('/web-https', mystudentInfo)
app.use('/web-https', studentTakenCS548)
app.use('/web-https', specificCourseSearch)

server.listen(8081, () => {
    console.log('Server is up on port 8081')
})