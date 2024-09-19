import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Peer from '../utils/webrtc';
import socket from '../utils/socket';
import { useParams } from 'react-router-dom';
import callCutButton from '/callCutButton.png'

function Meeting() {
    const localStream = useRef(null);
    const remoteStream = useRef(null);
    const peerConnectionRef = useRef(null);
    const initiator = useSelector(state => state.rtc.initiator);
    const { roomId } = useParams();

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
        };
    }, []);

    const handleCallCut = ()=>{
      peerConnectionRef.current.close();
      localStream.current.srcObject.getTracks().forEach(track => track.stop());
    }

    return (
        <div className='relative h-full w-full'>
            <video ref={localStream} autoPlay muted playsInline className='w-[400px] h-[370px] shadow-md rounded-lg object-cover absolute z-50 right-0 top-0'></video>
            <video ref={remoteStream} autoPlay playsInline className='w-full h-screen object-contain'></video>
            <div className='absolute bottom-7 w-full flex justify-center'>
              <img src={callCutButton} onClick={handleCallCut} className='h-16 w-16 rounded-full cursor-pointer' alt="call-cut-button" />
            </div>
        </div>
    );
}

export default Meeting;