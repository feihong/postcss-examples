const pagesDir = './pages/'

const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')
const pug = require('pug')
const express = require('express')

const app = express()
app.use(express.static('public'))
app.locals.basedir = path.join(__dirname, 'templates')
app.set('view engine', 'pug')
app.set('views', 'pages')

// Map the URL to the actual file path of the .pug template. Return null if the
// file doesn't exist.
async function getActualPath(url) {
  // Try the specific .pug file
  let result = path.join(pagesDir, url) + '.pug'
  if (await fileExists(result)) {
    return result
  }
  // Pug file doesn't exist, try index.pug under directory
  result = path.join(pagesDir, url, 'index.pug')
  if (await fileExists(result)) {
    return result
  }
  return null
}

// Return true if the file at the given path exists; false otherwise.
async function fileExists(filePath) {
  try {
    let stat = await fs.stat(filePath)
    return true
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false
    } else {
      throw err
    }
  }
}

// Serve the home page
app.get('/', async (req, res) => {
  res.render('index.pug')
})

// Serve up pages
app.get('/:path(*)', async (req, res) => {
  let path_ = await getActualPath(req.params.path)

  if (path_ !== null) {
    try {
      console.log(path_);
      res.render(path_.substring(6))
    } catch (err) {
      res.status(500).send(`Unexpected error: <pre>${err.message}</pre>`)
    }
  } else {
    res.status(404).send('Page not found')
  }
})

const listener = app.listen(process.env.PORT || 8000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
