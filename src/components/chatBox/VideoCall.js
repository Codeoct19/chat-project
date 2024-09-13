import React, { useEffect, useState } from 'react';
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
const VideoCallModal = ({ show, onClose, callRoomId, loginUser, secondUser }) => {
  const [zp, setZp] = useState(null);

  useEffect(() => {
    if (show && callRoomId && loginUser && secondUser) {
      const appID = 411705423;
      const serverSecret = 'ecf455930e6fb8a25b2ce2968db7d388';
      const userID = Math.floor(Math.random() * 10000) + "";
      const userName = loginUser.fname;
      const roomID = callRoomId;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID, userName);
      const zpInstance  = ZegoUIKitPrebuilt.create(kitToken);

      zpInstance.joinRoom({
        container: document.getElementById('videoChat'),
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: true,
        showTextChat: true,
        showUserList: true,
        maxUsers: 50,
        layout: "Auto",
        showLayoutButton: true,
      })
      setZp(zpInstance);
    }
  }, [show, callRoomId, loginUser, secondUser]);
  
  if (zp) {
    const start = document.querySelector('[class="BYpXSnOHfrC2td4QRijO"]');
    if (start) {
      start.addEventListener('click', (event) => {
        if (event.target && event.target.matches('[class="mCx2N1NwuMWObjjTeG0q"]')) {
         console.log('Button clicked!');
          onClose();
        }
      });
    } else {
      console.error('Start element not found');
    }
    
  }

  if (!show) { return null; }

  return (
    <div className={`w-0 ${onClose ? 'd-block' : 'd-none' }`}>
      <div className='videoChat'></div>
    </div>
  );
};

export default VideoCallModal;