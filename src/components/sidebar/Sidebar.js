// SideBar.js
import React, { useContext, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import Logout from '../logout/logout';
import { Context } from '../context/Context';
import "./SideBar.css";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';

import { GoHomeFill } from "react-icons/go"; // Home tab Icons
import { GrHomeRounded } from "react-icons/gr";

import { LuLayoutDashboard } from "react-icons/lu"; // Dashboard tab Icons
import { RiDashboardFill } from "react-icons/ri";

import { PiGlobeHemisphereWest, PiGlobeHemisphereWestFill } from "react-icons/pi"; // Country tab Icons
import { RiMapLine, RiMapFill } from "react-icons/ri";  // State tab Icons
import { PiCityLight, PiCityFill } from "react-icons/pi"; // City tab Icons

import { FaRegUser } from "react-icons/fa"; // Profile tab Icons
import { FaUser } from "react-icons/fa";

import { FaRegMessage, FaMessage } from "react-icons/fa6"; // ChatBox tab Icons

const defaultImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpBkqdjbZlBInm3KW3AMcXRzW-j12wscRIYIGLZ2Ev4g&s';
  const SideBar = ({logo}) => {
    const { accessToken } = useContext(Context);
    const { role } = jwtDecode(accessToken);
    const [activeIcon, setActiveIcon] = useState('');
    const handleIconClicked = (icon) => { setActiveIcon(icon); };

    // Handle this for Called logout function
    const handleLogout = () => { Logout(); };
  
    return (
      <>
      <Navbar expand='xxl' className="bg-white shadow-sm navbar-white rounded w-100 position-fixed">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center nav-logo">
            <img src={`http://localhost:8080/userImg/images/image_1724831166701_resized.png`} alt="Logo" />
          </div>
          <div className='flex-row'>
            <Nav as="ul" className="d-flex align-items-center">
              <Nav.Item as="li" className="px-2">
                <LinkContainer to="/" onClick={() => {handleIconClicked('Home')}}>
                  <Nav.Link className="d-flex justify-content-center px-3 nav-link-wrapper">
                    {activeIcon === 'Home' ? <GoHomeFill color='RoyalBlue'/> : <GrHomeRounded color='gray'  />}
                    <span className="icon-label">Home</span>
                  </Nav.Link>
                </LinkContainer>
              </Nav.Item>
              {role === 1 && (
                <>
                  <Nav.Item as="li" className="px-2">
                    <LinkContainer variant="light" to="/userlist" onClick={() => {handleIconClicked('Dashboard')}} >
                      <Nav.Link className="d-flex justify-content-center px-3 nav-link-wrapper">
                        {activeIcon === 'Dashboard' ? <RiDashboardFill color='RoyalBlue'/> : <LuLayoutDashboard color='gray'/>}
                        <span className="icon-label">Dashboard</span>
                      </Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                  <Nav.Item as="li" className="px-2">
                    <LinkContainer to="/countries" onClick={() => {handleIconClicked('Country')}}>
                      <Nav.Link className="d-flex justify-content-center px-3 nav-link-wrapper">
                        {activeIcon === 'Country' ? <PiGlobeHemisphereWestFill color='RoyalBlue'/> : <PiGlobeHemisphereWest color='gray' />}
                        <span className="icon-label">Country</span>
                      </Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                  <Nav.Item as="li" className="px-2">
                    <LinkContainer to="/state" onClick={() => {handleIconClicked('State')}}>
                      <Nav.Link className="d-flex justify-content-center px-3 nav-link-wrapper">
                        {activeIcon === 'State' ? <RiMapFill color='RoyalBlue' /> : <RiMapLine color='gray' />}
                        <span className="icon-label">State</span>
                      </Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                  <Nav.Item as="li" className="px-2">
                    <LinkContainer to="/city" onClick={() => {handleIconClicked('City')}}>
                      <Nav.Link className="d-flex justify-content-center px-3 nav-link-wrapper">
                        {activeIcon === 'City' ? <PiCityFill color='RoyalBlue' /> : <PiCityLight color='gray' />}
                        <span className="icon-label">City</span>
                      </Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                </>
              )}
              <Nav.Item as="li" className="px-2">
                <LinkContainer to="/profile" onClick={() => {handleIconClicked('Profile')}}>
                  <Nav.Link className="d-flex justify-content-center px-3 nav-link-wrapper">
                    {activeIcon === 'Profile' ? <FaUser color='RoyalBlue'/> : <FaRegUser color='gray' />}
                    <span className="icon-label">Profile</span>
                  </Nav.Link>
                </LinkContainer>
              </Nav.Item>
              <Nav.Item as="li" className="px-2">
                <LinkContainer to="/inbox" onClick={() => {handleIconClicked('Messages')}} >
                  <Nav.Link className="d-flex justify-content-center px-3 nav-link-wrapper">
                    {activeIcon === 'Messages' ? <FaMessage color='RoyalBlue'/> : <FaRegMessage color='gray'/>}
                    <span className="icon-label">Messages</span>
                  </Nav.Link>
                </LinkContainer>
              </Nav.Item>
            </Nav>
          </div>
          <div className="d-flex flex-row justify-content-center profile-user-content">
            <div className="user-logout-btn"><Logout onLogout={handleLogout} IconName={activeIcon} /></div>
            <div className="user-image"> <img src={logo !== null && logo !== '' ? `http://localhost:8080/userImg/images/${logo}` : defaultImageUrl} height="30" alt="Logo" className="me-3"/> </div>
          </div>
        </Container>
      </Navbar>
      </>
    )
  }
export default SideBar;