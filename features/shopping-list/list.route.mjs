import { Router } from "express";
import { ShoppingListModel } from "./list.model.mjs";
import { createSchema } from "./create.schema.mjs";

/**
 * @type {import("express").Router}
 */
export const router = new Router()
const model = new ShoppingListModel()

router.get('/', (req, res) => {
  res.json({items: model.getAll()})
})

router.get('/:name', (req, res) => {
  const item = model.getOne(req.params.name)
  res.json({item})
})

router.post('/', (req, res) => {
  const item = createSchema.parse(req.body)
  model.create(item)
  res.json({
    added: item
  })
})


router.patch('/:name', (req, res) => {
  const name = req.params.name
  const item = createSchema.parse(req.body)
  if (name !== item.name) {
    throw new Error('Name cannot be changed')
  }
  model.update(item)
  res.json({
    updated: item
  })
})

router.delete('/:name', (req, res) => {
  const name = req.params.name
  model.delete(name)
  res.json({
    message: 'Deleted'
  })
})

router.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }
  res.status(400).json({
    error: error.message
  })
})