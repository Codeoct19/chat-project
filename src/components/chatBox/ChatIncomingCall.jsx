export function ChatIncomingCall({caller, incomingCall, showIncomingPopup, secondUser, handleRejectVideoCall, handleAcceptVideoCall, handleRejectVoiceCall, handleAcceptVoiceCall}){
    return(
        <div>
          {incomingCall && (
          <div className="incoming-call">
            <div className="call-info">
                <div className="avatar-placeholder"></div>
                    <div className="call-details">
                        <p className="user-name">{secondUser?.first_name} {secondUser?.last_name}</p>
                        <p className="call-type">video call</p>
                    </div>
                </div>
            <div className="call-actions">
                <button className="reject-button" onClick={handleRejectVideoCall}></button>
                <button className="accept-button" onClick={handleAcceptVideoCall}></button>
            </div>
          </div>
          )}
          {showIncomingPopup && (
            <div className="incoming-call">
                <div className="call-info">
                   <div className="avatar-placeholder">
                     <img />
                   </div>
                   <div className="call-details">
                     <p className="user-name">{`${caller?.fname} ${caller?.lname}`}</p>
                     <p className="call-type">voice call</p>
                   </div>
                </div>
                <div className="call-actions">
                  <button className="reject-button" onClick={handleRejectVoiceCall}></button>
                  <button className="accept-button" onClick={handleAcceptVoiceCall}></button>
                </div>
            </div>
           )} 
        </div>
    );  
}