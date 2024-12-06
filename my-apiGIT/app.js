import express from 'express'
import usersRouter from './routers/users.router.js'
import clientRouter from './routers/client.router.js'
import roomRouter from './routers/room.router.js'
import reservationRouter from './routers/reservation.router.js'
const app = express()

app.use(express.json())

app.use('/users', usersRouter)
app.use('/client', clientRouter)
app.use('/room', roomRouter)
app.use('/reservation', reservationRouter)

app.get('/', (req, res)=>{
    //console.log(req.params)
    //res.status()
    res.status(201).json({  // retourne cette message 
        message: 'Hello World'
    })
})

app.get('/:id', (req, res)=>{
    res.json({
        message: 'The id is ' + req.params.id
    })
})

app.post('/',(req, res)=>{
    res.json(req.body)
})

export default app
