const http = require('http')
const qs = require('querystring') 
const url = require('url')
const Projects = require('./projects');

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 8000

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    return handleGet(req, res)
  } else if (req.method === 'POST') {
    return handlePost(req, res)
  } else {
    return handleError(res, 404)
  }
})

function handleGet(req, res) {
  const { pathname } = url.parse(req.url)
  if (pathname !== '/projects') {
    return handleError(res, 404)
  }
  res.setHeader('Content-Type', 'application/json')
  return res.end(JSON.stringify(Projects.findAll()))
}

function handlePost(req, res) {
  const size = parseInt(req.headers['content-length'], 10)
  const buffer = Buffer.allocUnsafe(size)
  var pos = 0

  const { pathname } = url.parse(req.url)
  if (pathname !== '/projects') {
    return handleError(res, 404)
  }

  req 
    .on('data', (chunk) => { 
      const offset = pos + chunk.length 
      if (offset > size) { 
        reject(413, 'Too Large', res) 
        return 
      } 
      chunk.copy(buffer, pos) 
      pos = offset 
    }) 
    .on('end', () => { 
      if (pos !== size) { 
        reject(400, 'Bad Request', res) 
        return 
      } 
      let project;
      try{
        project = JSON.parse(buffer.toString())
      }catch(e){
        handleError(res, 400)
        return
      }
      if(!Projects.idAlreadyExists(project.id)){
        Projects.save(project)
        console.log('Projects Posted: ', project) 
        res.statusCode = 201
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(Projects.findAll()))
      } else {
        handleError(res, 400)
      }
    })
}

function handleError (res, code) { 
  if(code === 400){
    res.statusCode = 400
    res.setHeader('Content-Type', 'application/json')
    res.end('{"message": "BAD REQUEST"}')
  } else{
    res.statusCode = code 
    res.setHeader('Content-Type', 'application/json')
    res.end(`{"error": "${http.STATUS_CODES[code]}"}`)   
  }
}


server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

module.exports = server
