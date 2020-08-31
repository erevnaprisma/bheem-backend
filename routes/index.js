var express = require('express')
var router = express.Router()

/* GET home page. */

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})
router.get('/contact-us', function (req, res, next) {
  res.render('contact-us', { title: 'Express' })
})
router.get('/about-us', function (req, res, next) {
  res.render('about-us', { title: 'Express' })
})
router.get('/index', function (req, res, next) {
  res.render('', { title: 'Express' })
})

router.get('/materi', function (req, res, next) {
  res.render('materi', { title: 'Express' })
})
router.get('/start-course', function (req, res, next) {
  res.render('start-course', { title: 'Express' })
})
router.get('/attendance', function (req, res, next) {
  res.render('attendance', { title: 'Express' })
})
router.get('/take-attendance', function (req, res, next) {
  res.render('take-attendance', { title: 'Express' })
})

router.get('/course', function (req, res, next) {
  // //query
  let listCourse = [
    {_id:'xxxxxx', title: 'course pertama'},
    {_id:'xxxxxx', title: 'course pertama'},
    {_id:'xxxxxx', title: 'course pertama'},
    {_id:'xxxxxx', title: 'course pertama'},
    {_id:'xxxxxx', title: 'course pertama'},
    {_id:'xxxxxx', title: 'course pertama'},
    {_id:'xxxxxx', title: 'course pertama'},
  ]

  // res.render('cek', { title: 'Express' })
  // res.send('respond with a resource');
  res.render('course', { title: 'Express', listCourse: listCourse })
})

module.exports = router
