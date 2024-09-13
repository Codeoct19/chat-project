import React, { useState } from "react";
import Swal from "sweetalert2";
import { apiRequest } from '../../utils/APIUtils';
import styled from "styled-components";    
const CloseMButton   = styled.section`
    margin-left: 312px;
    border: none; 
    font-size: 26px;
`;  
const AddCity = ({ addCityModal, setAddModal, selectCountry, fetchUrl}) => {
    const [selectedCountry, setSelectedCountry] = useState({ country_name: "", country_id: "" });
    const [selectedState, setSelectedState] = useState({ state_name: "", state_id: "" });
    const [displayState, setDisplayState] = useState("");
    const [city, setCity] = useState({city:''});
    const [errors, setErrors] = useState({ country_name: '', state_name: '', city: '' });
    let errorMessage = '';

    const handleClose = () => {
        setAddModal(false);
    };

    const handleCountry = async (event) => {
        const {value} = event.target;
        const selectCountryID = event.target.selectedOptions[0].getAttribute("data-key");
        setSelectedCountry({ country_name: value, country_id: selectCountryID });
        if (value !== '' ) {
          setErrors({ ...errors, country_name: ''});
        }
        try {
          const method = 'POST';
          const data = {id: selectCountryID};
          const endpoint = '/Address/getState';
          const response = await apiRequest(method, endpoint, data);
          const {stateResult } = response.data;
          setDisplayState(stateResult);
        } catch (error) {
          console.log('error', error);
        }
    };

    const handleState = (event) => {
        const selectStateID = event.target.selectedOptions[0].getAttribute("data-key");
        const { value } = event.target;
        if (value !== '' ) {
            setErrors({ ...errors, state_name: ''});
        }
        setSelectedState({ state_name: value, state_id: selectStateID });
    };
    const handleCity = (event) =>{
        const {name, value} = event.target;
        if (value !== '' ) {
            setErrors({ ...errors, city: ''});
        }
        setCity({...city, [name]: value})
    }
    console.log('errors :', errors);
    const handleSubmit = async(e) => {
        e.preventDefault();
        if (selectedCountry.country_name === '' ) {
            errorMessage = 'Please select a country' ;
            setErrors({ ...errors, country_name: errorMessage});
        }else if(selectedState.state_name === ''){
            errorMessage = 'Please select a state' ;
            setErrors({ ...errors, state_name: errorMessage});
        }else if(city.city === ''){
            errorMessage = 'Please enter a city' ;
            setErrors({ ...errors, city: errorMessage});
        }else{
            try {
                const method = 'POST';
                const data = {Country: selectedCountry, State: selectedState, city_name: city};
                const endpoint = '/Address/addCity';
                const response = await apiRequest(method, endpoint, data);
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'City Inserted',
                        text: 'City Inserted successfully!',
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            fetchUrl();
                            handleClose();
                        }
                    });
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    setErrors({ ...errors, city: 'city already exists' });
                } else {
                    console.error('Error:', error);
                }
            }
        }
    }
    return (
        <div className={`modal ${addCityModal ? 'd-block' : 'd-none'}`} tabIndex="-1" role="dialog">
            <div className="modal-dialog text-black" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" style={{ color: "black" }}>Add City</h5>
                        <CloseMButton type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                            <span aria-hidden="true">&times;</span>
                        </CloseMButton>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="country" className="form-label">Country:</label>
                                <select id="country" className="form-control" onChange={handleCountry} value={selectedCountry.id}>
                                    <option value="">Select a country</option>
                                    {selectCountry.map((country) => (
                                        <option key={country.id} value={country.country} data-key={country.id}>
                                            {country.country}
                                        </option>
                                    ))}
                                </select>
                                {errors.country_name && <span className="text-danger">{errors.country_name}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="state" className="form-label">State:</label>
                                <select id="state" className="form-control" onChange={handleState} value={selectedState.id}>
                                    <option value="">Select a state</option>
                                    {displayState && displayState.map((state) => (
                                        <option key={state.id} value={state.state} data-key={state.id}>
                                            {state.state}
                                        </option>
                                    ))}
                                </select>
                                {errors.state_name && <span className="text-danger">{errors.state_name}</span>}

                            </div>
                            <div className="form-group">
                                <label htmlFor="city" className="form-label">City:</label>
                                <input type="text" name="city" className="form-control" placeholder="Enter City" value={city.city} onChange={handleCity} />
                                {errors.city && <span className="text-danger">{errors.city}</span>}

                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                        <button type="button" onClick={handleSubmit} className="btn btn-primary top-update-btn">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCity;
