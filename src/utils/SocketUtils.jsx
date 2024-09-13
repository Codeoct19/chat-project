import { useEffect } from "react";

export const onSetSocket = (socket, loginUser, searchText, UserCurrentMessage, incrementUnreadMessages, setAllUsers, setCallStatus, setCaller, setShowIncomingPopup, setCallRecevier, setShowCallingScreen, setWs, setOnlineUsers, setUserChat) => {
  
  setWs(socket);
  console.log('socket.....', socket);
  socket.on('connect', () => {
    if (loginUser && loginUser?.userid) {
      socket.emit("loginUser", loginUser);
    }
  });

  socket.on('userList', (userList) => {
    console.log('UserList', userList);
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
    socket.disconnect();
  })
}