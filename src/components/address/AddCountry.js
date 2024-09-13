import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import Swal from "sweetalert2";
import styled from "styled-components";    
import { apiRequest } from '../../utils/APIUtils';

const AddCountry = ({setShowModal, showModal, fetchUrl}) => {

    const [country, setCountry] = useState({country:''});
    const [errors, setErrors] = useState({country: ''}); 

    const handleSubmit = async(event) => {
        event.preventDefault();
        if (errors.country === '' && country.country !== '') {
            const tok = localStorage.getItem('access_token');
            const {userid} = jwtDecode(tok);
            try {
                const method = 'POST';
                const data = {country, userid};
                const endpoint = '/Address/Addcountry';
                const response = await apiRequest(method, endpoint, data);
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: "Country Register",
                        closeOnClickOutside: false,
                    }).then(async result => {
                        if (result.isConfirmed) {
                            handleClose();
                            fetchUrl();
                        }
                    });
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    setErrors({ ...errors, country: 'Country already exists' });
                } else {
                    console.error('Error:', error);
                }
            } 
        }   
    }
    const handleChange = (e) => {
        const {value} = e.target;
        let errorMessage = '';
        if (value === '') {
            errorMessage = 'Please select a country';
        }
        setCountry({country: value});
        setErrors({ ...errors, country: errorMessage});
    }

    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <div className={`modal ${showModal ? 'd-block' : 'd-none'}`} tabIndex="-1" role="dialog">
            <div className="modal-dialog text-black" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-black" >Add country</h5>
                        <CloseMButton type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                            <span aria-hidden="true">&times;</span>
                        </CloseMButton>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="country" className="form-label">Country:</label>
                                <input type="text" id="country" name="country" className="form-control" placeholder="Enter your country name" value={country.country} onChange={handleChange} />
                                {errors.country && <span className="text-danger">{errors.country}</span>}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                                <button type="submit" className="btn btn-primary top-update-btn" id="updateButtonTop">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddCountry;
const CloseMButton   = styled.section`
    margin-left: 312px;
    border: none; 
    font-size: 26px;
`;  