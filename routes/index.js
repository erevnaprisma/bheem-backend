var express = require('express')
var router = express.Router()
const fs = require('fs')
const jwt = require('jsonwebtoken')
const config = require('config')
const formidable = require('formidable')
const FileModel = require('../src/collections/file/Model')
const pathmodule = require('path')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})
router.get('/renderfile/:filename', (req, res, next) => {
  res.sendFile(pathmodule.join(__dirname + '/../uploadfile/' + req.params.filename))
  // res.sendFile(__dirname + './uploadfile/1595349658069.png')
})
router.post('/uploadfile', (req, res, next) => {
  const form = formidable({ multiples: true })
  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err)
      return
    }
    const { path, size, name, type, mtime } = files.file
    const now = new Date().getTime()
    try {
      const { accesstoken } = req.headers
      const bodyAt = await jwt.verify(accesstoken, config.get('privateKey'))
      const { user_id: userId } = bodyAt
      const fileType = type.split('/').pop()
      const newPath = `./uploadfile/${now}.${fileType}`
      console.log('newPath===>', newPath)
      var source = fs.createReadStream(path)
      var dest = fs.createWriteStream(newPath)

      source.pipe(dest)
      source.on('end', function () { console.log('success copy') })
      source.on('error', function (err) { console.log('error copy ', err) })

      const data = {
        mtime: mtime,
        file_size: size,
        file_type: fileType,
        filename: '' + now + '',
        filenameorigin: name,
        created_at: now,
        updated_at: now,
        created_by: userId,
        updated_by: userId
      }
      const detailData = await FileModel.create(data)
      // return { status: 200, success: 'Successfully save Data', detail_data: await Subject.create(data) }
      res.json({ status: 200, success: 'Successfully save Data', detail_data: detailData })
    } catch (err) {
      console.log('errorrr====>', err)
      // return { status: 400, error: err }
      res.json({ fields, files, status: 400, error: err })
    }
    // res.writeHead(200, { 'content-type': 'application/json' })
    // res.end(JSON.stringify({ fields, files }, null, 2))
    // res.render('index', { title: req.body.name })
  })
})

module.exports = router
