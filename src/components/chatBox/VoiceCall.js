import React, { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';

const VoiceCallModal = ({ callStatus, socket, caller, Receiver }) => {
  
  const [socketRef, setSocketRef] = useState(null);
  const localAudioRef = useRef();
  const localStreamRef = useRef();
  const remoteAudioRef = useRef();

  useEffect(() => {
   if (socket.connected) {
    setSocketRef(socket);
   }
  }, [callStatus, socket, caller, Receiver]);

  if(callStatus === 'active'){
  
  }
  
  return(
    <>
    <div>
      <audio ref={localAudioRef} autoPlay muted /> 
      <audio ref={remoteAudioRef} autoPlay />
    </div>
    </>
  ) 
}
export default VoiceCallModal;