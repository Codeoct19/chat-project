import React, { useEffect, useState } from 'react';
import { FaVolumeUp } from 'react-icons/fa';
import '../../asset/CallScreen.css';
import VoiceCallModal from './VoiceCall';

const CallingScreen = ({Receiver, socket, caller, setShowCallingScreen, callStatus}) => {
  const [callDuration, setCallDuration] = useState(0);
 
  const handleEndCall = () => {
    if(socket.connected){
     const message = {callReceiver: Receiver, caller: caller}
     socket.emit('EndCall', message);
     setShowCallingScreen(false);
    }
  }
  useEffect(() => {}, [Receiver, caller, callStatus]);

  useEffect(() => {
    if (callStatus === 'active') {
     let intervalId;
     const startTime = Date.now();
     intervalId = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - startTime) / 1000));
     }, 1000);
     return () => clearInterval(intervalId);
    } else {
     setCallDuration(0);
    }
  }, [callStatus]);
  
   // Duration formatting.......
   const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600) % 24;
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
   }

  return (
    <div className="calling-screen">
      <>
        <div className="call-info"> 
          <div className="avatar-placeholder">
            <img />
          </div>
          <p className="call-status">{Receiver && `${Receiver?.first_name} ${Receiver?.last_name}`}</p> 
          <p className="call-status">{callStatus === 'active' && formatDuration(callDuration)}</p> 
          <p className="call-status">{callStatus === 'calling' && 'calling...'}</p> 
        </div>  
        <div className="call-actions">
          <button className="action-button">
            <FaVolumeUp />
            <span>Speaker</span>
          </button>
          <button className="action-button end-call" onClick={handleEndCall}>
            <img src="http://localhost:8080/userImg/images/end-call-icon-9.jpg" alt="End Call" className="end-call-icon" />
            <span>End Call</span>
          </button>
          {callStatus === 'active' && <VoiceCallModal socket={socket} Receiver={Receiver} caller={caller} callStatus={callStatus}/>}
        </div>
      </>
    </div>
  );
}; 
export default CallingScreen;