import express from 'express'
import 'dotenv/config'
import http from 'http'
import {Server} from 'socket.io'
import cors from 'cors'

const port = process.env.PORT || 4000

const app = express();
app.use(cors({
    origin:process.env.FRONTEND_DEVELOPMENT_URL
}))

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:process.env.FRONTEND_DEVELOPMENT_URL
    }
})

let rooms = {

}

io.on('connection',(socket)=>{
    console.log(socket.id)

    socket.on('offer',(offer,roomId)=>{
        if(rooms[roomId]&&rooms[roomId].length<2){   
            socket.join(roomId)
            rooms.push(socket.id)
        }else{
            rooms[roomId]=[]
        }

        socket.broadcast.emit('offer',offer)
    })
})



app.get('/',(req,res)=>{
    res.json({
        message:'hii from server'
    })
})

server.listen(port,()=>{
    console.log('server is running at '+port)
})