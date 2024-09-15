import React,{useEffect, useRef} from 'react'

function Meeting() {
    const myFeedVideo = useRef(null) 

    useEffect(()=>{

    },[])

  return (
    <div className='relative h-full w-full flex'>
        <video src="" ref={localFeed} className='w-[50%] h-full'></video>
        <video src="" ref={remoteFeed} className='w-[50%] h-full'></video>
    </div>
  )
}

export default Meeting