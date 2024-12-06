import express from 'express'
import * as usersController from '../controllers/usres.controller.js'
// import { getUsers } from '../controllers/usres.controller.js'
const router = express()

router.get('/', usersController.getUsers)

export default router 