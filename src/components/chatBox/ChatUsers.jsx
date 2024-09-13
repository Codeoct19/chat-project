import ScrollToBottom from 'react-scroll-to-bottom';
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faFaceMeh, faFileCirclePlus, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Picker from '@emoji-mart/react';

export function ChatUsers({ userChat, loginUser, secondUser, defaultImageUrl, dropdownRefs, toggleDropdown, dropdownOpen, showEmojiPicker, handleCloseClick, onSendMessage, FileChange, preview, handleKeyDown, setInput, input, refOfInput, emojiData, setShowEmojiPicker, deleteForEveryone, deleteForMe }) {
    
  // Formating Date --------------------
  const formatTimestamp = (timestamp) => {
    const messageDate = new Date(timestamp);
    const currentDate = new Date();
    const elapsedTime = currentDate.getTime() - messageDate.getTime();
    const minutes = Math.floor(elapsedTime / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) { return `${days}d ago`; } 
    else if (hours > 0) { return `${hours}h ago`; }
    else if (minutes > 0){ return `${minutes}m ago`;}
    else { return 'Just now'; }
  };

  // OnEmojiClick functionality ------------------------
  const onEmojiClick = (event) => {
    const cursor = refOfInput.current.selectionStart;
    const text = input.slice(0, cursor) + event.native + input.slice(cursor);
    setInput(text);
  };

  return (
    <>
      <div className="card-body" data-mdb-perfect-scrollbar="true" style={{ position: 'relative', height: '400px' }}>
        <ScrollToBottom className="message-input h-auto">
          <ul className="list-unstyled text-white">
            {userChat && userChat.map((message, index) => {
              const isSentMessage = parseInt(loginUser?.userid) === message?.user_id;
              const user = isSentMessage ? loginUser : secondUser;
              const userImg = user?.image !== '' ? `http://localhost:8080/userImg/images/${user?.image}` : defaultImageUrl;
              return (
                <React.Fragment key={index}>
                  {message.side === 'left' ? (
                    <>
                    <li className="d-flex justify-content-end mb-4">
                      <div className='d-flex flex-row align-items-center'>
                        <p className="text-black small text-black-margin mx-3 mt-3">{formatTimestamp(message.created_at)}</p>
                        <div className="w-auto">
                          {message.messages !== 'This message was deleted' ? (
                            <>
                              <div className="dropup-center dropup" ref={el => (dropdownRefs.current[message.id] = el)}>
                                <ul className={`dropdown-menu dropup-menu ${dropdownOpen === message.id ? 'show' : ''}`}>
                                  <li>
                                    <button type="button" className="dropdown-item" onClick={() => deleteForEveryone(message.id)}>delete for everyone</button>
                                  </li>
                                  <li>
                                    <button type="button" className="dropdown-item" onClick={() => deleteForMe(message.id, message.user_id)}>delete for me</button>
                                  </li>
                                </ul>
                              </div>
                            </>
                          ) : ''}
                          {message.messages !== 'This message was deleted' ? (
                            <>
                              {message.image_url ? (
                                <div className="card-body chat-img">
                                  <img src={`http://localhost:3001/public/images/${message.image_url}`} alt="received image" className="img-fluid" />
                                </div>
                              ) : (
                                <div className="card-body royalblue-msg">
                                  <p className="mb-0">{message.messages}</p>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="card-body royalblue-msg">
                              <p className="mb-0">{message.messages}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {message.messages !== 'This message was deleted' && ( 
                        <FontAwesomeIcon onClick={() => toggleDropdown(message.id)} className="settingIcon" icon={faEllipsisVertical} data-bs-toggle="dropdown" aria-expanded={dropdownOpen === message.id} />
                      )}
                    </li>
                    </>
                  ) : (
                    <li className={`d-flex justify-content-start text-black mb-4`}>
                      {message.messages !== 'This message was deleted' && ( 
                        <FontAwesomeIcon onClick={() => toggleDropdown(message.id)} className="settingIcon"  icon={faEllipsisVertical} data-bs-toggle="dropdown" aria-expanded={dropdownOpen === message.id} />
                      )}
                      <div className="dropup-center dropup" ref={el => (dropdownRefs.current[message.id] = el)}>
                        <ul className={`dropdown-menu ${dropdownOpen === message.id ? 'show' : ''}`}>
                          <li><button type="button" className="dropdown-item" onClick={() => deleteForMe(message.id, message.user_id)}>delete for me</button></li>
                        </ul>
                      </div>
                      <img src={userImg && userImg} alt="avatar" className="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="50" />
                      <div className='mx-3 d-flex flex-row-reverse '>
                        {message.messages !== 'This message was deleted' ? (
                          <div className="d-flex justify-content-between pt-3 custom-border">
                            <p className="text-black small fw-bold-margin">{formatTimestamp(message.created_at)}</p>
                          </div>
                        ) : ''}
                        {message.messages !== 'This message was deleted' ? (
                          <>
                            <div className="w-auto mt-2">
                              {message.image_url ? (
                                <div className="card-body chat-img">
                                  <img src={userImg} alt="received image" className="img-fluid" />
                                </div>
                              ) : (
                                <div className="card-body royalgray-msg ">
                                  <p className="mb-0">{message.messages}</p>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className='d-flex'>
                              <p className="text-black small fw-bold-margin mt-3">{formatTimestamp(message.created_at)}</p>
                            </div>
                            <div className="card-body royalgray-msg mt-2">
                              <p className="mb-0">{message.messages}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </li>
                  )}
                </React.Fragment>
              ); 
            })}
          </ul>
          <div className="chat-input p-3 position-fixed">
            <div className="input-container">
              <div className="input-group mb-3 input-content">
                {showEmojiPicker ? <button className="input-group-text border-0 bg-white text-secondary border-0" onClick={handleCloseClick} ><FontAwesomeIcon icon={faChevronDown} /></button> :
                  <button className="input-group-text bg-white text-secondary border-0" onClick={() => setShowEmojiPicker(!showEmojiPicker)}><FontAwesomeIcon icon={faFaceMeh} /></button>}
                {showEmojiPicker && (<> <div className="pickerDiv"><Picker data={emojiData} onEmojiSelect={onEmojiClick} /> </div> </>)}
                <input value={input} ref={refOfInput} onChange={(e) => setInput(e.target.value)} type="text" onKeyDown={handleKeyDown} className="form-control border-0" placeholder="Type your message..." />
                {preview && (
                  <div className="img-preview">
                    <img src={preview} alt="Selected" />
                  </div>
                )}
                <input type="file" id="fileInput" className="d-none" onChange={FileChange} />
                <button className="btn bg-white text-secondary border-0" onClick={() => document.getElementById('fileInput').click()}><FontAwesomeIcon className="border-0" icon={faFileCirclePlus} /></button>
                <button className="btn btn-primary" onClick={onSendMessage}> Send </button>
              </div>
            </div>
          </div>
        </ScrollToBottom>
      </div>
    </>
  );
}