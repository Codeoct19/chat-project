import React, { useState, useEffect, useRef, useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../asset/ChatBox.css';
import { socket } from '../Socket';
import VideoCallModal from '../components/chatBox/VideoCall';
import Swal from 'sweetalert2';
import { Container, Row, Col, Button} from 'react-bootstrap';
import { Context } from '../components/context/Context';
import CallingScreen from '../components/chatBox/CallScreen';
import EditModal from '../components/chatBox/EditUserDtlModal';
import { ChatUserList } from '../components/chatBox/ChatUserList';
import { ChatHeader } from '../components/chatBox/ChatHeader';
import { ChatUsers } from '../components/chatBox/ChatUsers';
import { ChatIncomingCall } from "../components/chatBox/ChatIncomingCall";
import { sendMsg, currentMessages, SearchUser } from "../utils/ChatUtils";
import { onSetSocket } from "../utils/SocketUtils";
   
const defaultImageUrl = 'http://localhost:3001/public/images/chat_1720443750151.png';

const ChatContent = ({ loggedInimg }) => {

  const [ws, setWs] = useState(null); // Set Socket in this
  const [input, setInput] = useState(''); // Send message input Box

  const [dropdownOpen, setDropdownOpen] = useState(false);  // dropDown For delete messages
  const dropdownRefs = useRef({});  // dropDown Refs

  const [userChat, setUserChat] = useState(null); // Store userChat in this
  const [allUsers, setAllUsers] = useState([]); // All Users of user listing

  const [showChatBox, setShowChatBox] = useState(false); // For chatBox none and diplay
  const [secondUser, setSecondUser] = useState(null); // seconduser to interactive

  const [loginUser, setLoginUser] = useState(null); // login User (mean you)

  const [firstUserMessages, setFirstUserMessages] = useState({}); // Mean logged user messages
  const [secondUserMessages, setSecondUserMessages]= useState({}); // Mean interface user messages

  const [unreadMessages, setUnreadMessages] = useState([]); // For notifiation
  const [activeTab, setActiveTab] = useState(null); // Active user on listing
  const [searchText, setSearchText] = useState(''); // searching Users

  const [filteredUsers, setFilteredUsers] = useState([]); // Use For Listing User
  const [onlineUsers, setOnlineUsers] = useState({}); 

  const [chatid, setChatid] = useState(null); // Chat Id for interect Chat
  const {loggedInUser, handleEdit } = useContext(Context); // get loginuse and that image
  
  const [file, setFile] = useState(null); // set image url in this state

  const [numeric, setNumeric] = useState(0); // use this on searching user
  const [callRoomId, setCallRoomId] = useState(null); // Room Id for calling between two users 

  const [showEmojiPicker, setShowEmojiPicker] = useState(false); 
  const refOfInput = useRef(null); 

  const [emojiData, setEmojiData] = useState(null); // set emoji which send to second user
  const [preview, setPreview] = useState('');

  const [showVideoCall, setShowVideoCall] = useState(false); 
  const [incomingCall, setIncomingCall] = useState(false); // incoming Call Showing Second User

  // Voice Call
  const [showCallingScreen, setShowCallingScreen] = useState(false);
  const [showIncomingPopup, setShowIncomingPopup] = useState(false);
  const [callRecevier, setCallRecevier] = useState(null);
  const [caller, setCaller] = useState(null);
  const [callStatus, setCallStatus] = useState('idle');

  // Set logged In User Functionality ----------------
  useEffect(() => {
   try { const user = JSON.parse(loggedInUser); setLoginUser(user); }
   catch (error) { console.error("Invalid JSON string:", error); setLoginUser(loggedInUser); }
  }, [loggedInUser]);

  // Use images URL previews --------------
  const onEditClick = () => { handleEdit({ id: loginUser?.userid, fname: loginUser?.fname,  lname: loginUser?.lname,  email: loginUser?.email});};

  // chat box Img.....
  useEffect(() => { return () => { if (preview) { URL.revokeObjectURL(preview); } };}, [preview]);

  // Emoji Picker functionality ----------------
  useEffect(() => {
    fetch('/emoji-data.json')
    .then((response) => response.json())
    .then((data) => setEmojiData(data))
    .catch((error) => console.error('Error fetching emoji data:', error));
  }, []);

  // Socket logics --------------
  useEffect(() => {
    onSetSocket(socket, loginUser, searchText, UserCurrentMessage, incrementUnreadMessages, setAllUsers, setCallStatus, setCaller, setShowIncomingPopup, setCallRecevier, setShowCallingScreen, setWs, setOnlineUsers, setUserChat);
  },[socket, loginUser, onSetSocket, searchText]);

 
  // User latest messages functionality ------------------
  function UserCurrentMessage(latestUserMessage) {
    currentMessages(latestUserMessage, loginUser, setFirstUserMessages, setSecondUserMessages);
  }

  // Get Unread Message || Get Notification functionality -----------------
  const incrementUnreadMessages = (userId, sender) => {
    setUnreadMessages((prevUnreadMessages) => {
      const newCount = (prevUnreadMessages[userId] || 0) + 1;
      return { ...prevUnreadMessages, [sender]: newCount };
    });
  };

  // unread Message remove || Notification remove functionality -----------------
  const resetUnreadMessages = (userId, receiptId) => {
    ws.emit('resetUnreadMessage', {userId, receiptId});
    setUnreadMessages((prevUnreadMessages) => {
      const { [userId]: _, ...reset } = prevUnreadMessages;
      return reset;
    });
  }

  // Send Messages functionality -----------------
  const onSendMessage = () => {
    sendMsg(input, file, secondUser, loginUser, ws, chatid);
    handleCloseClick();
    setInput('');
    setFile(null);
    setPreview('');
  }

  // Searching Users functionality ------------------
  const handleSearch = async(e) => {
    const searchText = e.target.value.toLowerCase();
    setSearchText(searchText);
    SearchUser(ws, allUsers, numeric, searchText, loginUser, setFilteredUsers, setNumeric);
  }

  // Set users for user listing
  useEffect(() => {
    if(numeric === 0){
      const filteredUsers = allUsers.filter(user => {
        const fullName = `${user?.first_name} ${user?.last_name}`;
        return fullName.toLowerCase().includes(searchText);
      });
      setFilteredUsers(filteredUsers);
    }
  }, [allUsers]);

  // handler Click User in listing -------------------
  useEffect(() => {
    if (showChatBox && secondUser) {
      const firstId = parseInt(loginUser.userid);
      const secondId = parseInt(secondUser.id);
      const chatId = firstId < secondId ? `${firstId}${secondId}` : `${secondId}${firstId}`;
      setChatid(chatId);

      const message = { chatid: chatId, userid: loginUser.userid, secondId};
      if (chatId !== '') {
        ws.emit('selectChatUsers', message);
        handleCloseClick();
        setInput('');
        setPreview('');
      }
    }
  }, [showChatBox, secondUser, chatid, searchText]);

  // Control Enter Button -------------------
  const handleKeyDown = (e) => { if (e.key === 'Enter') { onSendMessage(); } };

  //  Delete For messages functionality ----------------------
  const deleteForEveryone = (messageId) => {
    const message = {chatId: chatid, messageId: messageId, loginUserId: loginUser.userid, secondUserId: secondUser.id};
    Swal.fire({
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Delete for everyone'
    }).then((result) => {
      if(result.isConfirmed){
        ws.emit('deleteForEveryone', message);
        const updatedMessages = userChat.map((message) =>
          message.id === messageId ? { ...message, messages: 'This message was deleted', deleted: true } : message
        );
        setUserChat(updatedMessages);
      }
    })
  };

  // Delete For me functionality
  const deleteForMe = (messageId, userId) => {
    Swal.fire({
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Delete for me'
    }).then((result) => {
      if(result.isConfirmed){
        const message = {messageId, userId}
        ws.emit('deleteForMe', message);
        const updatedMessages = userChat.filter(message => message.id !== messageId);
        setUserChat(updatedMessages);
      }
    })
  };

  // Handle Click listing User functionality ------------------
  const handleClickUser = (user) => {
    if (user && user.id) {
      setActiveTab(user.id);
      setSecondUser(user);
      setShowChatBox(true);
    } else {
      console.warn('Invalid user object:', user);
    }
  };

  // Join and leave Room functionality ------------------
  useEffect(() => {
    if (ws && loginUser && secondUser && secondUser.id) {
      const roomId = `${loginUser?.userid}_${secondUser.id}`;
      ws.emit('joinRoom', roomId);
    }
    return () => {
      if (ws && secondUser && secondUser.id) {
        const roomId = `${loginUser?.userid}_${secondUser?.id}`;
        ws.emit('leaveRoom', roomId);
      }
    };
  }, [secondUser, loginUser]);

  // dropDown delete chat messages functionality ---------------------
  const toggleDropdown = (messageId) => {
    setDropdownOpen(dropdownOpen === messageId ? null : messageId);
  };

  useEffect(() => {
   const handleClickOutside = (event) => {
    if (dropdownOpen !== null) {
      if (dropdownRefs.current[dropdownOpen] && !dropdownRefs.current[dropdownOpen].contains(event.target)) {
        setDropdownOpen(null);
      }
    }
   };
   document.addEventListener('mousedown', handleClickOutside);
   return () => {
    document.removeEventListener('mousedown', handleClickOutside);
   };
  }, [dropdownOpen]);

  // Handle limit of messages ----------------------
  const truncateText = (text, length) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  // Handle edit user details ---------------------------
  const FileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) { setFile(selectedFile); setPreview(URL.createObjectURL(selectedFile)); setInput(selectedFile.name); }
  };

  // Emoji functionality ---------------------------
  const handleCloseClick = () => {
    setShowEmojiPicker(false);
  };

  // Video Call functionality -------------------------
  const handleVideoCall = () => {
    if (secondUser && loginUser) {
      const roomId = `${loginUser?.userid}_${secondUser.id}`;
      setCallRoomId(roomId);
      setShowVideoCall(true);
      ws.emit('initiateCall', { roomId, loginUser, secondUser });
    }
  };

  const handleCloseVideoCall = () => {
    setShowVideoCall(false);
    setIncomingCall(false);
    setCallRoomId(null);
    ws.emit('endCall', { roomId: callRoomId });
  };

  const handleAcceptVideoCall = () => {
    setIncomingCall(false);
    setShowVideoCall(true);
  };

  const handleRejectVideoCall = () => {
    setIncomingCall(false);
    setCallRoomId(null);
  };

  // Voice Call functionality ---------------------
  const handleVoiceCall = () => {
    setShowCallingScreen(true);
    setCallRecevier(secondUser);
    const message = {
      callReceiver: secondUser, 
      caller: loginUser
    };
    setCallStatus('calling');
    ws.emit('showIncomingCall', message); 
  }
    
  const handleAcceptVoiceCall = () => {
    setShowIncomingPopup(false);
    setCallStatus('active');
    const callRoom = loginUser?.userid > secondUser?.id ? `${secondUser?.id}_${loginUser?.userid}` : `${loginUser?.userid}_${secondUser?.id}`;;
    const message = {
     callReceiver: secondUser,
     caller: loginUser,
     callRoomId: callRoom
    };
    if(message){
     const callIsConnected = ws.emit('callConnected', message); 
     if (callIsConnected) {
      ws.emit('callerActive', message);
     }
    }
  }

  const handleRejectVoiceCall = () => {
    ws.emit('RejectVoiceCall', {callRecevier, caller});
    setCallStatus('idle');
    setShowIncomingPopup(false);
    setShowCallingScreen(false);
    setCaller(null);
    setCallRecevier(null);
  }
  return (
   <>
    <div className="main-Container">
      <div className='mt-1 d-flex flex-column flex-grow-1 bg-shadow over-flow-hidden'>
        <div className="css-1dbjc4n">
          <div className='d-flex flex-column flex-grow-1 over-flow-hidden bg-white'>
            <div className='d-flex flex-column flex-grow-1 over-flow-hidden'>
              <div className='d-flex flex-grow-1 over-flow-hidden'>
                {filteredUsers && <> 
                  <ChatUserList loggedInimg={loggedInimg} defaultImageUrl={defaultImageUrl} loginUser={loginUser} onEditClick={onEditClick} handleSearch={handleSearch} filteredUsers={filteredUsers} secondUserMessages={secondUserMessages} firstUserMessages={firstUserMessages} unreadMessages={unreadMessages} onlineUsers={onlineUsers} activeTab={activeTab} handleClickUser={handleClickUser} resetUnreadMessages={resetUnreadMessages} truncateText={truncateText} />
                  <VideoCallModal show={showVideoCall} onClose={handleCloseVideoCall} callRoomId={callRoomId} loginUser={loginUser} secondUser={secondUser} handleVoiceCall={handleVoiceCall} handleVideoCall={handleVideoCall}/>
                  {userChat !== null ? (
                    <>
                    <div className={`w-100 mainDivChat ${showChatBox ? 'd-block' : 'd-none'}`}>
                      <ChatHeader secondUser={secondUser} defaultImageUrl={defaultImageUrl} onlineUsers={onlineUsers} handleVideoCall={handleVideoCall} handleVoiceCall={handleVideoCall}/>
                      <ChatIncomingCall caller={caller} incomingCall={incomingCall} showIncomingPopup={showIncomingPopup} secondUser={secondUser} handleRejectVideoCall={handleRejectVideoCall} handleAcceptVideoCall={handleAcceptVideoCall} handleRejectVoiceCall={handleRejectVoiceCall} handleAcceptVoiceCall={handleAcceptVoiceCall}/>
                      {showVideoCall && <button type="button" className="edit-m-close" data-dismiss="modal" aria-label="Close" onClick={handleCloseVideoCall}> <span aria-hidden="true">&times;</span> </button>}
                      {showCallingScreen && <CallingScreen Receiver={callRecevier} caller={caller} socket={ws} setShowCallingScreen={setShowCallingScreen} callStatus={callStatus} />} 
                      <ChatUsers deleteForEveryone={deleteForEveryone} deleteForMe={deleteForMe} loginUser={loginUser} secondUser={secondUser} defaultImageUrl={defaultImageUrl} emojiData={emojiData} dropdownRefs={dropdownRefs} toggleDropdown={toggleDropdown} dropdownOpen={dropdownOpen} showEmojiPicker={showEmojiPicker} handleCloseClick={handleCloseClick} onSendMessage={onSendMessage} FileChange={FileChange} preview={preview} handleKeyDown={handleKeyDown} setInput={setInput} input={input} refOfInput={refOfInput} setShowEmojiPicker={setShowEmojiPicker} userChat={userChat} />
                    </div>
                    </> ):(
                    <Container fluid className="d-flex flex-column justify-content-between vh-100 bg-light">
                      <Row className="flex-grow-1 d-flex align-items-center justify-content-center">
                        <Col xs={12} md={6} className="text-center">
                          <div className="mb-4 text-warning">
                            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" fill="currentColor" className="bi bi-chat-dots" viewBox="0 0 16 16">
                              <path d="M8 2a6 6 0 0 1 6 6 5.975 5.975 0 0 1-1.358 3.79A6.003 6.003 0 0 1 8 16a5.993 5.993 0 0 1-3.999-1.406L1.79 14.79a.5.5 0 0 1-.79-.407V11.8A6.003 6.003 0 0 1 2 8a6 6 0 0 1 6-6zm0 12a4.98 4.98 0 0 0 3.304-1.261.5.5 0 0 1 .587.054l1.516 1.516a.5.5 0 0 0 .854-.354v-2.386a.5.5 0 0 1 .15-.357A4.98 4.98 0 0 0 14 8a5 5 0 1 0-10 0 4.98 4.98 0 0 0 1.261 3.304.5.5 0 0 1-.054.587L3.042 13.65a.5.5 0 0 0-.354.854l1.516 1.516a.5.5 0 0 1 .054.587A4.98 4.98 0 0 0 8 14zm-.5-5.5a.5.5 0 1 1 1 0v1a.5.5 0 1 1-1 0v-1zm0-3a.5.5 0 1 1 1 0v1a.5.5 0 1 1-1 0v-1zm2 1.5a.5.5 0 1 1 0-1h1a.5.5 0 1 1 0 1h-1z"/>
                            </svg>
                          </div>
                          <h5 className="mb-3 text-info">Chat is empty</h5>
                          <p className="text-muted mb-4">Be the one to break the ice</p>
                          <div className="d-flex justify-content-center">
                            <Button variant="primary" className="mx-2">Hey everyone 👋</Button>
                            <Button variant="primary" className="mx-2">Ready! 😊</Button>
                            <Button variant="primary" className="mx-2">Hello from Paris 🇫🇷</Button>
                          </div>
                        </Col>
                      </Row>
                    </Container>
                  )}</>
                } 
              </div>
            </div>
          </div>
        </div>
      </div>
      {loginUser && <EditModal />}
    </div>
   </>
  );
}

export default ChatContent;