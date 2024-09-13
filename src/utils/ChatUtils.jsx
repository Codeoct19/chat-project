import { apiRequest } from '../utils/APIUtils';

export const sendMsg = (input, file, secondUser, loginUser, ws, chatid) => {
  if ((input.trim() !== '' || file) && secondUser && loginUser && ws) {
    const secondId = secondUser.id;
    const roomId = `${loginUser?.userid}_${secondUser.id}`;
    const message = { loginUser, input, secondId, file: null, roomId };
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        message.file = reader.result;
        message.input = 'Image';
        ws.emit('sendMessage', message);
        const messages = { chatid: chatid, userid: loginUser.userid, secondId};
        ws.emit('selectChatUsers', messages);
      };
      reader.readAsDataURL(file);
    } else {
      ws.emit('sendMessage', message);
      const messages = { chatid: chatid, userid: loginUser.userid, secondId};
      ws.emit('selectChatUsers', messages);
    }
  }
}

export const SearchUser = async (ws, allUsers, numeric, searchText, loginUser, setFilteredUsers, setNumeric) => {
  setNumeric(1);
  const userId = loginUser.userid; 
  const message = { userId, searchText };
  if (searchText !== ''){
    const method = 'POST';
    const endpoint = '/chat/searchUsers';
    const response = await apiRequest(method, endpoint, message, '');
    const filteredUsers = response.data.filter(user => {
      const fullName = `${user?.first_name} ${user?.last_name}`;
      return fullName.toLowerCase().includes(searchText);
    });
    if(numeric === 1){
      setFilteredUsers(filteredUsers);
    }
  } else {
    ws.emit("loginUser", loginUser);
    const filteredUsers = allUsers.filter(user => {
      const fullName = `${user?.first_name} ${user?.last_name}`;
      return fullName.toLowerCase().includes(searchText);
    });
    setFilteredUsers(filteredUsers);
    setNumeric(0);
  }
}

export const currentMessages = (latestUserMessage, loginUser, setFirstUserMessages, setSecondUserMessages) => {
  const userId = latestUserMessage[0]?.second_user;
  const waslogin = latestUserMessage[0]?.user_id;
  const currentLoginId = loginUser?.userid;
  const newMessage = { messages: latestUserMessage[0]?.messages, created_at: latestUserMessage[0]?.created_at, second_user: userId, login_id: waslogin };
  if (currentLoginId === waslogin) { loginSide(userId, newMessage); 
    return loginSide;
  }
  if (currentLoginId === userId) { 
    SecondUserLogin(waslogin, newMessage);
  }
  
  // For loginUser functionality ----------------
  function loginSide(userId, newMessage){
    setFirstUserMessages((prevUserMessages) => {
      const updatedMessages = { ...prevUserMessages, [userId]: newMessage };
      return updatedMessages;
    });
  }
 
  // For another intrective user functionality ----------------
  function SecondUserLogin(waslogin, newMessage){
    setSecondUserMessages((prevUserMessages) => {
      const updatedMessages = { ...prevUserMessages, [waslogin]: newMessage }
      return updatedMessages;
    });
  }
}