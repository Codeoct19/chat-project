
  socket.on('showIncomingCall', message => {
    const {callReceiver, caller} = message;
    io.to(callReceiver.id).emit('showIncomingCall', caller);
  });

  socket.on('RejectVoiceCall', message => {
    const {callReceiver, caller} = message;
    io.to(caller?.userid).emit('RejectVoiceCall', callReceiver);
  });

  socket.on('EndCall', message => {
    const {callReceiver, caller} = message;
    io.to(callReceiver?.id).emit('EndCall', caller);
  });

  socket.on('signal', ({ signal, to }) => {
    io.to(to).emit('signal', { signal, from: socket.id });
  });

  socket.on('callConnected', message => {
    const {callRoomId, callReceiver} = message;
    socket.join(callRoomId);
    const emited = io.to(callRoomId).emit('callConnected', message);
    if(emited){
      socket.leave(callRoomId);
      io.to(callReceiver?.id).emit('callerActive', message);
    }
  });

  socket.on('callerActive', message => {
    const {caller} = message;
    if(caller){
     io.to(caller?.userid).emit('callerActive', message);
    }
  });


//  server side-----

socket.on('showIncomingCall', message => {
  const {callReceiver, caller} = message;
  io.to(callReceiver.id).emit('showIncomingCall', caller);
});

socket.on('RejectVoiceCall', message => {
  const {callReceiver, caller} = message;
  io.to(caller?.userid).emit('RejectVoiceCall', callReceiver);
});

socket.on('EndCall', message => {
  const {callReceiver, caller} = message;
  io.to(callReceiver?.id).emit('EndCall', caller);
});

socket.on('signal', ({ signal, to }) => {
  io.to(to).emit('signal', { signal, from: socket.id });
});

socket.on('callConnected', message => {
  const {callRoomId, callReceiver} = message;
  socket.join(callRoomId);
  const emited = io.to(callRoomId).emit('callConnected', message);
  if(emited){
    socket.leave(callRoomId);
    io.to(callReceiver?.id).emit('callerActive', message);
  }
});

socket.on('callerActive', message => {
  const {caller} = message;
  if(caller){
   io.to(caller?.userid).emit('callerActive', message);
  }
});
 
// socket utils here

socket.on('showIncomingCall', (caller) => {
  setShowIncomingPopup(true);
  setCaller(caller);
});

socket.on('RejectVoiceCall', () => {
  setShowCallingScreen(false);
});

socket.on('EndCall', () => {
  setShowIncomingPopup(false);
  setShowCallingScreen(false);
});

socket.on('callConnected', message => {
  const {caller, callReceiver} = message;
  setCaller(caller);
  setCallRecevier(callReceiver);
  if(callReceiver !== null && caller !== null){
    setShowCallingScreen(true);
    setCallStatus('active');
  }
}); 

socket.on('callerActive', message => {
  setCallStatus('active');
});