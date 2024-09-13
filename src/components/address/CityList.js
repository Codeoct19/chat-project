import React, { useEffect, useState } from "react";
import { apiRequest } from '../../utils/APIUtils';
import AddCity from "./AddCity";
import Swal from "sweetalert2";
import styled from "styled-components";
import { PaginatedTable } from "../../utils/tablePagination/PaginatedTable";

const CloseMButton = styled.section`
  margin-left: 312px;
  border: none; 
  font-size: 26px;
`;

const CityList = () => {
  const [data, setData] = useState([]);
  const [selectCountry, setSelectCountry] = useState([]);
  const [addModal, setAddModal] = useState(false);
  const [editCity, setEditCity] = useState({ country: '', state: '', city_name: '' });
  const [showEdit, setShowEdit] = useState(false);
  const [errors, setErrors] = useState({ country: "", state: "", city_name: "" });

  // Send city list request on server
  async function fetchUrl() {
    try {
      const method = 'POST';
      const endpoint = '/Address/cityList';
      const response = await apiRequest(method, endpoint);
      const { countryResult, cityResult } = response.data;
      setData(cityResult);
      setSelectCountry(countryResult);
    } catch (error) {
      console.log('Err', error);
    }
  }
  useEffect(() => {
    fetchUrl();
  }, [])

  // Send city delete request on server
  const handleDel = async (element) => {
    try {
      const City_id = element.id;
      Swal.fire({
        title: 'Are you sure?',
        text: 'City Delete!',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const method = 'POST';
          const data = { id: City_id };
          const endpoint = '/Address/cityDel';
          await apiRequest(method, endpoint, data);
          fetchUrl();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          fetchUrl();
        }
      });

    } catch (error) {
      console.error("Error delete request:", error);
    }
  }

  // Open Add state modal
  const handleAddCity = () => {
    setAddModal(true);
  }

  // send data in edit city modal
  const handleEdit = (element) => {
    setEditCity(element);
    setShowEdit(true);
  }

  // change city value
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (value === '') {
      setErrors({ ...errors, city_name: '' });
    }
    setEditCity({ ...editCity, [name]: value })
  }

  // Send Edit data of city request on server
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editCity.city_name === '') {
      setErrors({ ...errors, city_name: 'Please fill the city' });
      return;
    }
    try {
      Swal.fire({
        title: 'Are you sure?',
        text: 'City Update!',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK'
      }).then(async (result) => {
        if (result.isConfirmed) {
          const method = 'POST';
          const data = editCity;
          const endpoint = '/Address/cityEdit';
          await apiRequest(method, endpoint, data);
          setShowEdit(false);
          fetchUrl();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          setShowEdit(false);
          fetchUrl();
        }
      });
    } catch (error) {
      console.log('error :', error);
    }
  }
  const handleClose = () => {
    setErrors({ ...errors, country: "", state: "", city_name: "" });
    setShowEdit(false);
  }
  return (
    <div className="d-flex">
      <div className="container mt-5 text-black">
        <PaginatedTable data={data} itemsPerPage={5} handleEdit={handleEdit} handleDelete={handleDel} action={'city'} handleClick={handleAddCity} />
        <div className={`modal ${showEdit ? 'd-block' : 'd-none'}`} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: "black" }}>Update City</h5>
                <CloseMButton type="button" className="close" data-dismiss="modal" aria-label="Close" style={{ marginLeft: "312px", border: "none", fontSize: "26px" }} onClick={handleClose} >
                  <span aria-hidden="true">&times;</span>
                </CloseMButton>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="country" className="form-label">Country:</label>
                    <select id="country" className="form-control" value={editCity.country} name="country" >
                      <option value={editCity.country}>
                        {editCity.country}
                      </option>
                    </select>
                    {errors.country && <span className="text-danger">{errors.country}</span>}

                  </div>
                  <div className="form-group">
                    <label htmlFor="state" className="form-label">State:</label>
                    <select id="country" className="form-control" value={editCity.state} name="country" >
                      <option value={editCity.state}>
                        {editCity.state}
                      </option>
                    </select>
                    {errors.state && <span className="text-danger">{errors.state}</span>}

                  </div>
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">City:</label>
                    <input type="text" name="city_name" className="form-control" placeholder="Enter City" value={editCity.city_name} onChange={handleChange} />
                    {errors.city_name && <span className="text-danger">{errors.city_name}</span>}

                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                    <button type="button" className="btn btn-primary top-update-btn" onClick={handleSubmit}>Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {addModal && <AddCity setAddModal={setAddModal} addCityModal={addModal} selectCountry={selectCountry} fetchUrl={fetchUrl} />}
    </div>
  );
}

export default CityList;
