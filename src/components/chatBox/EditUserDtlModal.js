import React, {useContext} from "react";
import { Context } from '../context/Context';
const EditModal = () =>{
  const { editModal, handleClose, errors, handleChange, editData, handleFileChange, handleSubmit } = useContext(Context);
  return(
    <div className={`modal ${editModal ? 'd-block' : 'd-none'}`} tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h6 className="modal-title text-black">Update profile</h6>
          </div>
          <div className="modal-body text-black">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fname" className="form-label">First Name:</label>
                <input type="text" name="fname" className="form-control" placeholder="Enter your firstname" onChange={handleChange} value={editData?.fname} />
                {errors.fname && <div className="text-danger">{errors.fname}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="lname" className="form-label">Last Name:</label>
                <input type="text" name="lname" className="form-control" placeholder="Enter your lastname" onChange={handleChange} value={editData?.lname} />
                {errors.lname && <div className="text-danger">{errors.lname}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email:</label>
                <input type="text" name="email" className="form-control" placeholder="Enter your email" onChange={handleChange} value={editData?.email} />
                {errors.email && <div className="text-danger">{errors.email}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label"></label>
                <input type="file" className="form-control" onChange={handleFileChange} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                <button type="submit" className="btn btn-primary top-update-btn">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EditModal;