export const onSetSocket = (socket, loginUser, searchText, UserCurrentMessage, incrementUnreadMessages, setAllUsers, setCallStatus, setCaller, setShowIncomingPopup, setCallRecevier, setShowCallingScreen, setWs, setOnlineUsers, setUserChat) => {
  if(!socket.connected){
    socket.connect();
  }
  setWs(socket);
  socket.on('connect', () => {
    if (loginUser && loginUser?.userid) {
      socket.emit("loginUser", loginUser);
    }
  });

  socket.on('userList', (userList) => {
    if (searchText === ''){ 
      setAllUsers(userList);
    }
  });

  socket.on('selectChatUsers', (chatContent) => {
    setUserChat(chatContent);
  });
  
  socket.on('onlineUsers', (data) => {
    const updatedOnlineUsers = {};
    data.forEach(user => { updatedOnlineUsers[user] = 'online' });
    setOnlineUsers(updatedOnlineUsers);
  });

  socket.on('UserCurrentMessage', (currentMessage) => {
    UserCurrentMessage(currentMessage);
  });

  socket.on('newMessage', (currentMessage) => {
    incrementUnreadMessages(currentMessage.user_id, currentMessage.userId);
  });

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
 
  return(() => {
    if(socket.connected){
      socket.disconnect();
    }
    socket.on('callerActive');
    socket.on('connect');
    socket.on('userList');
  })
}