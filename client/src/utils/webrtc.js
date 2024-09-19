export default class Peer {
    constructor() {
        this.mediaConstraints = {
            video: true,
            audio: true
        };
        this.serverConstraints = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        };
    }

    async getUserMedia() {
        try {
            return await navigator.mediaDevices.getUserMedia(this.mediaConstraints);
        } catch (err) {
            console.error('Error - getUserMedia');
            throw err;
        }
    }

    async getPeerConnection() {
        const stream = await this.getUserMedia();
        const peerConnection = new RTCPeerConnection(this.serverConstraints);
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
        return peerConnection;
    }
}