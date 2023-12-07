import express from 'express';
import bodyParser from 'body-parser';
import { router as shoppingListRouter} from './features/shopping-list/list.route.mjs'

export const app = express()
const api = new express.Router()
app.use(bodyParser.json())

app.use('/api', api)
api.use('/items', shoppingListRouter)

app.use('/', express.static('static'))