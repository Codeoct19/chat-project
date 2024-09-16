import React, { useEffect, useRef, useState } from 'react';

const VoiceCallModal = ({ callStatus, socket, caller, Receiver }) => {
  
  const [socketRef, setSocketRef] = useState(null);
  const localAudioRef = useRef();
  const remoteAudioRef = useRef();

  useEffect(() => {
   if (socket.connected) {
    setSocketRef(socket);
   }
  }, [callStatus, socket, caller, Receiver]);

  
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