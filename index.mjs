import http from 'node:http';
import process from 'node:process';
import {db} from './db.mjs';
import {app} from './app.mjs'

db.init('db.json')

http.createServer(app).listen(parseInt(process.env.PORT) || 3000, () => {
  console.log(`Server started at ${process.env.PORT || 3000}`)
})
