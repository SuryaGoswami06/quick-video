import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Peer from '../utils/webrtc';
import socket from '../utils/socket';
import { useParams } from 'react-router-dom';
import callCutButton from '/callCutButton.png'
import { useNavigate } from 'react-router-dom';

function Meeting() {
    const localStream = useRef(null);
    const remoteStream = useRef(null);
    const peerConnectionRef = useRef(null);
    const initiator = useSelector(state => state.rtc.initiator);
    const { roomId } = useParams();
    const navigate = useNavigate()
    const [isFullScreen,setIsFullScreen] = useState(false)
    const [isMute,setIsMute] = useState(false)
    const [isCameraOff,setIsCameraOff] = useState(false)

    useEffect(() => {
        const init = async () => {
            const pc = new Peer();
            const stream = await pc.getUserMedia();
            localStream.current.srcObject = stream;
            peerConnectionRef.current = await pc.getPeerConnection();

            peerConnectionRef.current.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('iceCandidate', event.candidate, roomId);
                }
            };

            peerConnectionRef.current.ontrack = (event) => {
                remoteStream.current.srcObject = event.streams[0];
                console.log(event.streams[0])
            };
        };

        init();

        const waitPeerConnection = (callback) => {
            if (peerConnectionRef.current == null) {
                setTimeout(waitPeerConnection, 100, callback);
            } else {
                callback();
            }
        };

        socket.on('2nd-user-joined', async () => {
            if (initiator) {
                waitPeerConnection(async () => {
                    const offer = await peerConnectionRef.current.createOffer();
                    await peerConnectionRef.current.setLocalDescription(offer);
                    socket.emit('offer', offer, roomId);
                });
            }
        });

        socket.on('sorry',(msg)=>{
            const intervalid = setInterval(() => {
                alert(msg)
            }, 3000);

            setTimeout(()=>{
                clearInterval(intervalid)
            },15 * 1000)
        })

        socket.on('offer', async (offer) => {
            waitPeerConnection(async () => {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnectionRef.current.createAnswer();
                await peerConnectionRef.current.setLocalDescription(answer);
                socket.emit('answer', answer, roomId);
                console.log(answer+'answer')
            });
        });

        socket.on('answer', async (answer) => {
            waitPeerConnection(async () => {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            });
        });

        socket.on('ice', async (candidate) => {
            waitPeerConnection(async () => {
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            });
        });

        return () => {
            socket.off('2nd-user-joined');
            socket.off('answer');
            socket.off('ice');
            socket.off('offer');
            socket.off('sorry')
        };
    }, []);

    const handleCallCut = ()=>{
      peerConnectionRef.current.close();
      localStream.current.srcObject.getTracks().forEach(track => track.stop());
      navigate('/')
    }

    const handleFullScreen = ()=>{
        setIsFullScreen(prev=>!prev)
    }

    const handleAudioMuteStream =async (msg)=>{
        if(msg == 'off'){
            setIsMute(true)
            pauseResumeMediaStream(peerConnectionRef.current,'audio',false)
           }else{
            setIsMute(false)
            pauseResumeMediaStream(peerConnectionRef.current,'audio',true)
           }
        localStream.current.srcObject.getAudioTracks()[0].enabled = isMute
    }

    const pauseResumeMediaStream = (peerConnection,mediaType,isEnabled)=>{
        peerConnection.getSenders().forEach((sender)=>{
            if(sender.track){
                if(sender.track.kind==mediaType){
                    sender.track.enabled = isEnabled
                }
                if(sender.track.kind == mediaType){
                    sender.track.enabled = isEnabled
                }
            }
        })
    }

    const handleVideoMuteStream = (msg)=>{
       if(msg == 'off'){
        setIsCameraOff(true)
        pauseResumeMediaStream(peerConnectionRef.current,'video',false)
       }else{
        setIsCameraOff(false)
        pauseResumeMediaStream(peerConnectionRef.current,'video',true)
       }
        localStream.current.srcObject.getVideoTracks()[0].enabled = isCameraOff
    }

    return (
        <div className='relative h-[95vh] w-full'>
            <video 
            onClick={handleFullScreen}
            ref={localStream}
            autoPlay
            muted
            playsInline 
            className={isFullScreen?'w-full h-full object-contain':'w-[120px] h-[150px] md:w-[190px] md:h-[250px] lg:w-[400px] lg:h-[300px] shadow-md rounded-lg object-cover absolute z-50 right-1 top-1'}>
            </video>
            <video 
            onClick={handleFullScreen}
            ref={remoteStream} 
            autoPlay 
            playsInline 
            className={isFullScreen?'w-[120px] h-[150px] md:w-[190px] md:h-[250px] lg:w-[400px] lg:h-[300px] shadow-md rounded-lg object-cover absolute z-50 right-1 top-1':'w-full h-full object-contain'}>
            </video>
            <div className='absolute bottom-7 w-full flex justify-center'>
                <div className='bg-white h-16 w-16 rounded-full cursor-pointer mr-2'>
                    {
                        isCameraOff?<img onClick={()=>handleVideoMuteStream('on')} className='h-full w-full p-3' src="https://img.icons8.com/?size=100&id=10343&format=png&color=000000" alt="video-icon" />
                        :<img onClick={()=>handleVideoMuteStream('off')} className='h-full w-full p-3' src='https://img.icons8.com/?size=100&id=11402&format=png&color=000000' alt='video-mute-icon' />
                    }
                </div>
                <div className='bg-white h-16 w-16 rounded-full cursor-pointer mr-2'>
                    {
                        isMute?<img onClick={()=>handleAudioMuteStream('on')} className='h-full w-full p-3' src="https://img.icons8.com/?size=100&id=9414&format=png&color=000000" alt="audio-icon" />
                        :<img onClick={()=>handleAudioMuteStream('off')} className='h-full w-full p-3' src='https://img.icons8.com/?size=100&id=9982&format=png&color=000000' alt='audio-mute-icon' />
                    }
                </div>
              <img src={callCutButton} onClick={handleCallCut} className='h-16 w-16 rounded-full cursor-pointer' alt="call-cut-button" />
            </div>
        </div>
    );
}

export default Meeting;