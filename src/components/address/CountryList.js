import React, { useState, useEffect } from "react";
import AddCountry from "./AddCountry";
import Swal from "sweetalert2";
import styled from "styled-components";
import { apiRequest } from '../../utils/APIUtils';
import { PaginatedTable } from "../../utils/tablePagination/PaginatedTable";
import { socket } from "../../Socket";

const CloseMButton = styled.section`margin-left: 312px; border: none; font-size: 26px;`;
const Countrylist = () => {
  const [showModal, setShowModal] = useState(false);
  const [country, setCountry] = useState([]);
  const [errors, setErrors] = useState({ country: '' });
  const [showEdit, setShowEdit] = useState(false);
  const [countryData, setCountryData] = useState({ country: '' });

  const handleClick = () => {
   setShowModal(true);
  }

  const fetchurl = async () => {
    try {
      const response = await apiRequest('GET', '/Address/countryList');
      const { data } = response;
      const { result } = data;
      setCountry(result);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    fetchurl();
    if(socket.connected){socket.disconnect()}
  }, []);

  const handleDel = async (element) => {
    try {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Country Deleted!',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await apiRequest('POST', '/Address/delCountry', element);
          setShowEdit(false);
          fetchurl();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          setShowEdit(false);
          fetchurl();
        }
      });
    } catch (error) {
      console.log('error Delete method')
    }
  }

  const handleEdit = (element) => {
    setCountryData(element);
    setShowEdit(true);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value !== '') { setErrors({ ...errors, country: '' }); }
    setCountryData({ ...countryData, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (countryData.country === '') {
      setErrors({ ...errors, country: 'Please enter your country name' });
      return;
    }
    try {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Country Update!',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const method = 'POST';
          const data = countryData;
          const endpoint = '/Address/EditCountry';
          await apiRequest(method, endpoint, data);
          setShowEdit(false);
          fetchurl();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          setShowEdit(false);
          fetchurl();
        }
      });
    } catch (error) {
      console.log(error);
    }

  }

  const handleClose = () => {
    setErrors({ ...errors, country: '' });
    setShowEdit(false);
  }
  
  return (
    <>
      <div className="d-flex">
        <div className="container mt-5 text-black">
          <PaginatedTable data={country} itemsPerPage={5} handleEdit={handleEdit} handleDelete={handleDel} action={'country'} handleClick={handleClick}/>
          <div className={`modal ${showEdit ? 'd-block' : 'd-none'}`} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="modal-title text-black">Update country</h6>
                  <CloseMButton type="button" onClick={handleClose} className="close" data-dismiss="modal" aria-label="Close" >
                    <span aria-hidden="true">&times;</span>
                  </CloseMButton>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <label htmlFor="country" className="form-label">Country:</label>
                      <input type="text" id="country" name="country" className="form-control" placeholder="Enter your country name" value={countryData.country} onChange={handleChange} />
                    </div>
                    {errors.country && <span className="text-danger">{errors.country}</span>}
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                      <button type="submit" className="btn btn-primary top-update-btn" onClick={handleSubmit}>Submit</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showModal && <AddCountry setShowModal={setShowModal} showModal={showModal} fetchUrl={fetchurl} />}
      </div>
    </>
  )
}

export default Countrylist;