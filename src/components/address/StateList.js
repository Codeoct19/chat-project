import React, { useEffect, useState } from "react";
import AddState from "./AddState";
import Swal from "sweetalert2";
import { RegionDropdown } from "react-country-region-selector";
import styled from "styled-components";  
import {apiRequest} from "../../utils/APIUtils";
import { PaginatedTable } from "../../utils/tablePagination/PaginatedTable";
import { socket } from "../../Socket";

const CloseMButton = styled.section`margin-left: 312px; border: none;  font-size: 26px;`;  

const StateList = () => {
  const [showModal, setShowModal] = useState(false);
  const [countryData, setCountryData] = useState(null);
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState({ state: "" });
  const [editState, setEditState] = useState({state: "" });
  const [showEdit, setShowEdit] = useState(false);

  async function fetchUrl() {
    try {
      const method = "POST";
      const endpoint = "/Address/stateList";
      const response = await apiRequest(method, endpoint, data);
      const { stateResult, countryResult } = response.data;
      setData(stateResult);
      setCountryData(countryResult);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  useEffect(() => {
    fetchUrl();
    if(socket.connected){socket.disconnect()}
  }, []);
  const handleState = () => {
    setShowModal(true);
  }
  const handleEdit = (element) => {
    setShowEdit(true);
    setEditState(element);
  }
  const handleChange = (value) => {
    let errorMessage = '';
    if(value === ''){ errorMessage = 'Please select country'; }
    setErrors({ ...errors, state: errorMessage});
    setEditState({ ...editState, state: value });
  }
  const handleDel = async (element) => {
    try {
      const state_id = element.id;
      Swal.fire({
        title: 'Are you sure?',
        text: 'State Delete!',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const method = "POST";
          const endpoint = "/Address/stateDel";
          const data = {id: state_id};
          await apiRequest(method, endpoint, data);
          setShowEdit(false);
          fetchUrl();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          setShowEdit(false);
          fetchUrl();
        }
      });
    } catch (error) {
      console.error("Error delete request:", error);
    }
  }
  const submitState = async (e) => {
    e.preventDefault();
    try {
      if (errors.state === '') {
        Swal.fire({
          title: 'Are you sure?',
          text: 'State Update!',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        }).then(async (result) => {
          if (result.isConfirmed) {
            const endpoint = '/Address/EditState';
            const method = 'POST';
            const data = editState;
            await apiRequest(method, endpoint, data);
            setShowEdit(false);
            fetchUrl();
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            setShowEdit(false);
            fetchUrl();
          }
        });
      }
    } catch (error) {
      console.log('error :', error);
    }
  }
  const handleClose = () =>{ 
    setErrors({...errors, state: "" });
    setShowEdit(false);
  }
  
  return (
    <div className="d-flex">
      <div className="container text-black">
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button variant="success" className="mb-3 btn btn-light" onClick={handleState}>Add State</button>
        </div>
        <PaginatedTable data={data} itemsPerPage={5} handleEdit={handleEdit} handleDelete={handleDel} action={'state'} handleClick={handleState}/>
        <div className={`modal ${showEdit ? 'd-block' : 'd-none'}`} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-black">Update State</h5>
                <CloseMButton type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                  <span aria-hidden="true">&times;</span>
                </CloseMButton>
              </div>
              <div className="modal-body">
                <form onSubmit={submitState}>
                  <div className="form-group">
                    <label htmlFor="country" className="form-label">Country:</label>
                    <select id="country" className="form-control" value={editState.country} name="country">
                      <option value={editState.country}>
                        {editState.country}
                      </option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="state" className="form-label">State:</label>
                    <RegionDropdown id="state" name="state" className="form-control" country={editState.country} value={editState.state} onChange={handleChange} />
                  </div>
                  {errors.state && <span className="text-danger">{errors.state}</span>}
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                    <button type="submit" className="btn btn-primary top-update-btn">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && <AddState setShowModal={setShowModal} showModal={showModal} countryData={countryData} fetchUrl={fetchUrl} />}
    </div>
  );
}
export default StateList;