import { FaVideo, FaPhoneAlt  } from "react-icons/fa";
export function ChatHeader({secondUser, defaultImageUrl, onlineUsers, handleVideoCall, handleVoiceCall}) {
  return(
    <nav className="navbar bg-white shadow-sm">
      <div className="d-flex flex-row">
        <img src={secondUser && secondUser.image !== '' ? `http://localhost:8080/userImg/images/${secondUser.image}` : defaultImageUrl} alt="avatar" className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60" />
        {secondUser && 
        <div className="d-flex flex-column">
          <h5 className="mb-0 text-dark">{secondUser && `${secondUser.first_name} ${secondUser.last_name}`}</h5>
          {onlineUsers[secondUser.id] == 'online' ? <p className="text-muted mb-0">online</p> : ''}
        </div>
        }
      </div>
      <div>
        <button className="btn mx-1"><FaPhoneAlt  className="voice-call-icon text-primary" onClick={handleVoiceCall}/></button>
        <button className="btn mx-1"><FaVideo className="video-call-icon text-primary" onClick={handleVideoCall}/></button>
      </div>
    </nav>
  );
}