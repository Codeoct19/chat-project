import { NavLink } from 'react-router-dom';
import { FaCircle } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
export function ChatUserList({loggedInimg, defaultImageUrl, loginUser, onEditClick, handleSearch, filteredUsers, secondUserMessages, firstUserMessages, unreadMessages, onlineUsers, activeTab, handleClickUser, resetUnreadMessages, truncateText}){
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
  return(
    <div className="col-md-3 mb-4 mb-md-0 d-flex flex-column flex-shrink-0 bg-white custom-width mx-auto">
      <div className="shadow-sm text-black flex-grow-1">
        <div className="card-body left-card-body">
          <nav className="navbar navbar-white">
            <div className="d-flex flex-row align-items-center">
              <NavLink>
                <img src={loggedInimg !== '' && loggedInimg !== null ? `http://localhost:8080/userImg/images/${loggedInimg}` : defaultImageUrl} alt="avatar" className="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60" />
              </NavLink>
              <span className="custom-text">
                {loginUser && loginUser.fname} {loginUser && loginUser.lname}
              </span>
              <GoPencil className="edit-icon" onClick={onEditClick}/>
            </div>
          </nav>
          <ul className="list-unstyled mb-0 member-list over-flow-auto h-100">
            <div className="input-group rounded p-2">
              <input type="search" className="form-control rounded" onChange={handleSearch} placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
            </div>
            <div>
              {filteredUsers.length === 0 ? (
                <p className="text-center mt-3">No users found</p>
                ) : (
                  filteredUsers.map((user, index) => {
                  const fullName = `${user?.first_name} ${user?.last_name}`;
                  const userImg = user?.image != '' ? `http://localhost:8080/userImg/images/${user?.image}` : defaultImageUrl;
                  const userId = parseInt(user?.id);
                  const receiptId = parseInt(loginUser?.userid);
                  const latestMessage = secondUserMessages[userId] || firstUserMessages[userId];
                  const userStatus = onlineUsers[userId];
                  const unreadCount = unreadMessages[userId];
                    return (
                      <li key={index} className={`p-2 d-flex justify-content-between align-center ${activeTab === user?.id ? 'active' : ''} ${activeTab === user?.id ? 'bg-whitesmoke' : ''}`} onClick={() => { handleClickUser(user); resetUnreadMessages(userId, receiptId);}}>
                        <div className="d-flex flex-row">
                          <img src={userImg} alt="avatar" className="rounded-circle d-flex align-self-center me-3 shadow-1-strong mx-hw" width="60"/>
                          {userStatus === 'online' ?  <i className="fas fa-circle text-success"><FaCircle className="activeIcon"/> </i> : '' }
                          <div className="pt-1">
                            <p className="fw-bold mb-0">{truncateText(fullName , 12)}</p>
                            {latestMessage && (
                              <p className="text-black small mb-0 messages">{truncateText(latestMessage.messages , 14)}</p>
                            )}
                          </div>
                        </div>
                        <div className="notification-icon">
                          <div>
                            {latestMessage && (
                              <p className="text-black small mb-0 timeStamp">{formatTimestamp(latestMessage.created_at)}</p>
                            )}
                          </div>
                          {unreadCount && (
                            <div className="notification">
                              {unreadCount}
                            </div>
                          )}
                        </div>
                      </li>
                    )
                  })
                )
              }
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}