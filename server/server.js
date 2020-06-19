import express from 'express'
import path from 'path'
import cors from 'cors'
import bodyParser from 'body-parser'
import sockjs from 'sockjs'
import { renderToStaticNodeStream } from 'react-dom/server'
import React from 'react'
import axios from 'axios'

import cookieParser from 'cookie-parser'
import config from './config'

import Html from '../client/html'

const { readFile, writeFile } = require('fs').promises
const datas = require('./data')

let Root = () => ''

try {
  // eslint-disable-next-line import/no-unresolved
  Root = require('../dist/assets/js/root.bundle')
} catch (ex) {
  console.log(' run yarn build:prod to enable ssr')
}

let connections = []

const port = process.env.PORT || 8090
const server = express()

const middleware = [
  cors(),
  express.static(path.resolve(__dirname, '../dist/assets')),
  bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
  bodyParser.json({ limit: '50mb', extended: true }),
  cookieParser()
]

middleware.forEach((it) => server.use(it))

// const saveLogs = async (logs) => {
//   const result = writeFile(`${__dirname}/logs.json`, JSON.stringify(logs), { encoding: 'utf8' })
//   return result
// }

// const getLogs = async () => {
//   const result = readFile(`${__dirname}/logs.json`, { encoding: 'utf8' })
//     .then((data) => JSON.parse(data))
//     .catch(() => [])
//   return result
// }
const saveLogs = async (logs) => {
  const result = await writeFile(`${__dirname}/logs.json`, JSON.stringify(logs), {
    encoding: 'utf8'
  })
  return result
}
const getLogs = async () => {
  const result = await readFile(`${__dirname}/logs.json`, { encoding: 'utf8' })
    .then((data) => JSON.parse(data))
    .catch(() => [])
  return result
}

server.get('/api/v1/products', (req, res) => {
  res.json(datas.slice(0, 10))
})

server.get('/api/v1/rates', async (req, res) => {
  const { data: rates } = await axios('https://api.exchangeratesapi.io/latest?symbols=USD,CAD')
  res.json(rates)
})

server.post('/api/v1/logs', async (req, res) => {
  const newLogs = req.body
  const oldLogs = await getLogs()
  await saveLogs([...oldLogs, newLogs])
  res.json({ status: 'success' })
})

server.get('/api/v1/logs', async (req, res) => {
  const logs = await readFile(`${__dirname}/logs.json`, { encoding: 'utf8' }).then((data) =>
    JSON.parse(data)
  )
  res.json(logs)
})



server.use('/api/', (req, res) => {
  res.status(404)
  res.end()
})

const [htmlStart, htmlEnd] = Html({
  body: 'separator',
  title: 'Skillcrucial - Become an IT HERO'
}).split('separator')

server.get('/', (req, res) => {
  const appStream = renderToStaticNodeStream(<Root location={req.url} context={{}} />)
  res.write(htmlStart)
  appStream.pipe(res, { end: false })
  appStream.on('end', () => {
    res.write(htmlEnd)
    res.end()
  })
})

server.get('/*', (req, res) => {
  const initialState = {
    location: req.url
  }

  return res.send(
    Html({
      body: '',
      initialState
    })
  )
})

const app = server.listen(port)

if (config.isSocketsEnabled) {
  const echo = sockjs.createServer()
  echo.on('connection', (conn) => {
    connections.push(conn)
    conn.on('data', async () => {})

    conn.on('close', () => {
      connections = connections.filter((c) => c.readyState !== 3)
    })
  })
  echo.installHandlers(app, { prefix: '/ws' })
}
// console.log(`Serving at http://localhost:${port}`)
