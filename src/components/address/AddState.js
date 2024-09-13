import { apiRequest } from '../../utils/APIUtils';
import React, { useState } from "react";
import Swal from "sweetalert2";
import styled from "styled-components";    
const CloseMButton   = styled.section`
    margin-left: 312px;
    border: none; 
    font-size: 26px;
`;  
const AddState = ({ setShowModal, showModal, countryData, fetchUrl }) => {
    const [selectCountry, setSelectCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [countryId, setCountryId] = useState(null);
    const [errors, setErrors] = useState({ country: '', state: '' });

    const handleSubmit = async (event) => {
        event.preventDefault();
        let errorMessage = '';
        if (selectCountry === '' ) {
            errorMessage = 'Please select a country' ;
            setErrors({ ...errors, country: errorMessage});
            return;
        }else if(selectedState === ''){
            errorMessage = 'Please select a state' ;
            setErrors({ ...errors, state: errorMessage});
            return;
        }

        try {
            const method = 'POST';
            const data = {country_id: countryId, State: selectedState};
            const endpoint = '/Address/addState';
            const response = await apiRequest(method, endpoint, data);
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: "State Register",
                    closeOnClickOutside: false,
                }).then(result => {
                    if (result.isConfirmed) {
                        handleClose();
                        fetchUrl();
                    }
                });
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrors({ ...errors, state: 'State already exists' });
            } else {
                console.error('Error:', error);
            }
        }
    }

    const handleCountry = (event) => {
        const {value } = event.target;
        if (value !== '' ) {
            setErrors({ ...errors, country: ''});
        }
        const selectCountryID = event.target.selectedOptions[0].getAttribute("data-key");
        setCountryId(selectCountryID);
        setSelectCountry(value);

    };
     const handleChange = (e) => {
        const {value } = e.target;

        if (value !== '' ) {
            setErrors({ ...errors, state: ''});
        }
        setSelectedState(value);
     }
    const handleClose = () => setShowModal(false);

    return (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
            <div className="modal-dialog text-black" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" style={{ color: "black" }}>Add state</h5>
                        <CloseMButton type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                          <span aria-hidden="true">&times;</span>
                        </CloseMButton>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="country" className="form-label">Country:</label>
                                <select id="country" className="form-control" name="country" onChange={handleCountry} value={selectCountry}>
                                    <option value="">Select a country</option>
                                    {countryData.map((country) => (
                                        <option key={country.id} data-key={country.id} value={country.country} >
                                            {country.country}
                                        </option>
                                    ))}
                                </select>
                                {errors.country && <span className="text-danger">{errors.country}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="state" className="form-label">State:</label>
                                <input type="text" id="state" name="state" className="form-control" placeholder="Enter your country name" value={selectedState} onChange={handleChange} />
                                {errors.state && <span className="text-danger">{errors.state}</span>}
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                        <button type="button" className="btn btn-primary top-update-btn" id="updateButtonTop" onClick={handleSubmit}>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddState;
