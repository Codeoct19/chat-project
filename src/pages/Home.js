import React, { useContext } from "react";
import "../asset/Home.css";
import { useNavigate } from "react-router-dom";
import { Context } from "../components/context/Context";
import { FooterContent } from "../components/footer/Footer"; 
import { socket } from "../Socket";
  const HomePage = () => {
    const { accessToken } = useContext(Context);
    const navigate = useNavigate(); 
    const openLoginForm = () => { navigate('/login'); }
    if(socket.connected){socket.disconnect()}
    return(
      <div className="">
        <div className="home-container d-flex justify-content-center flex-nowrap flex-row">
          <div className="d-flex justify-content-center flex-nowrap flex-row">
            <div> 
              <div className="headerImg">
                <img src="http://localhost:8080/userImg/images/homePageImages.jpg" />
              </div>
              {accessToken === null && <div className="get-start">
                <button onClick={openLoginForm} className="loginBtn">Get Start</button>
              </div>}
              <div className="d-flex justify-content-center flex-nowrap flex-row">
                <div className="content">
                  <div className="heading-wl">
                    <h1 className="h-W-home">Welcome to <br/> your <span> home page</span></h1>
                  </div>
                  <div className="chat-instantly">
                    <h3>Chat instantly with anyone, anytime</h3>
                    <h4>Fast, easy, unlimited chat services</h4>
                  </div>
                </div>
                <div className="content-images">
                  <img src="https://uploads-ssl.webflow.com/5ec19145e5370d18c6fc5c9e/5ecc2f8b71c39539a4032f9a_hero-section-img-min.png" alt="homePage"/>
                </div>
              </div>
              <div className="instant-team-chats d-flex align-items-center flex-column">
                <h1>Instant Team Chats</h1>
                <p className="flex-item-text">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.</p>
                <div className="content-images">
                  <img src="http://localhost:8080/userImg/images/home-chat-content.jpg" alt="homePage"/>
                </div>   
              </div>
            </div> 
          </div>
        </div>
        <FooterContent /> 
      </div>
    )
  }
export default HomePage;