import React,{useEffect, useState} from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import meeting from '/video-call.svg'
import keyboard from '/keyboard.svg'
import Input from '../components/Input'
import { useNavigate } from 'react-router-dom'
import randomRoomId from '../utils/generateRoomId.js'
import {useDispatch} from 'react-redux'
import { setInitiator } from '../store/rtcSlice.js'
import socket from '../utils/socket.js'

function Home() {
    const [roomId,setRoomId] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleRoomIdChange = (e)=>{
        setRoomId(e.target.value)
    }
    
    const handleJoinRoom = ()=>{
        if(roomId.trim() !==''){
          socket.emit('join',roomId)
          dispatch(setInitiator(false))
          navigate(`/room/${roomId}`)
        }
    }

    const handleCreateRoom =async ()=>{
      const roomId = randomRoomId();
      socket.emit('join',roomId)
      dispatch(setInitiator(true))
      navigate(`/room/${roomId}`)
    }

  return (
    <div className='w-full h-screen'>
        <Header />
        <div className='mt-40 px-5 phone:ml-20 phone:w-[700px]'>
            <h2 className='text-4xl sm:text-5xl capitalize '>video calls and meetings for everyone</h2>
            <h4 className='my-3 text-lg sm:text-xl'>connect,collaborate and celebrate from anywhere with quick video</h4>
            <div className='flex items-center flex-col smallDevice:flex-row'>
                  <Button 
                  className='bg-primaryBlueBgColor hover:bg-primaryBlueHoverBgColor w-full smallDevice:mb-0 mb-4  px-5 py-3 rounded-md mr-2'
                  icon={meeting} 
                  type='button' 
                  onClick={handleCreateRoom} 
                  text='new meeting'
                    />
                    <Input 
                    type='text' 
                    icon={keyboard} 
                    placeholder='Enter a code' 
                    value={roomId}
                    onChange={handleRoomIdChange}
                    className='rounded-md smallDevice:mb-0 mb-4 py-3 w-full px-5 bg-[#181A1B] border border-primaryBorderColor outline-1 focus:outline outline-[#1256AF]'
                    />
                  <Button 
                  type='button' 
                  text='join' 
                  onClick={handleJoinRoom}
                  className='w-full smallDevice:w-fit ml-2 py-3 px-5 rounded-md hover:bg-white  hover:text-[#1256AF]' 
                  />
            </div>
        </div>
    </div>
  )
}

export default Home