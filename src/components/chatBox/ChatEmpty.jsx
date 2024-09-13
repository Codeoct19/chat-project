import Picker from '@emoji-mart/react';

export function ChatEmpty({}) {
    return(
        <div className="chat-input p-3 position-fixed">
            <div className="input-group">
                <div className="input-container">
                    <div className="input-group mb-3">
                        {showEmojiPicker ? <button className="input-group-text bg-white text-secondary" onClick={handleCloseClick} ><FontAwesomeIcon icon={faChevronDown} /></button> :
                          <button className="input-group-text bg-white text-secondary" onClick={() => setShowEmojiPicker(!showEmojiPicker)}><FontAwesomeIcon icon={faFaceMeh} /></button>}
                        {showEmojiPicker && (<> <div className="pickerDiv"><Picker data={emojiData} onEmojiSelect={onEmojiClick} /> </div> </>)}
                        <input value={input} ref={refOfInput} onChange={(e) => setInput(e.target.value)} type="text" onKeyDown={handleKeyDown} className="form-control" placeholder="Type your message..." />
                        {preview && (
                          <div className="img-preview">
                            <img src={preview} alt="Selected" />
                          </div>
                        )}
                        <input type="file" id="fileInput" className="d-none" onChange={FileChange} />
                        <button className="btn bg-white text-secondary border" onClick={() => document.getElementById('fileInput').click()}><FontAwesomeIcon icon={faFileCirclePlus} /></button>
                        <button className="btn btn-primary" onClick={sendMsg}> Send </button>
                    </div>
                </div>
            </div>
        </div>
    );
}