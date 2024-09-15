const constraint = {
    video:true,
    audio:true
}
const configuration = {
    'iceServers': [
        {'urls': 'stun:stun.l.google.com:19302'}
    ]
}

const getUserMedia = async ()=>{
    try{
      let stream = await navigator.mediaDevices.getUserMedia(constraint);
      return stream
    }catch(err){
        console.log(err+'from get_user_media_function');
    }
}
const instanceOfPeer = async ()=>{
    let stream = await getUserMedia();
    const peerConnection = new RTCPeerConnection(configuration);
    stream.getTracks().forEach(track=>peerConnection.addTrack(track,stream))
    return peerConnection
}

export {
    instanceOfPeer
}