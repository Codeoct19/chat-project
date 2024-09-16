import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registration from './components/registerForm/Register';
import Login from './components/loginForm/login';
import HomePage from './components/homePage/Home';
import DashbordPage from './components/dashboard/Dashboard';
import ProfilePage from './components/profile/Profile';
import { useContext, useState } from 'react';
import Countrylist from './components/address/CountryList';
import PageNotFound from './components/404Page';
import StateList from './components/address/StateList';
import CityList from './components/address/CityList';
import ChatContent from './components/chatBox/ChatBox';
import { Context } from './components/context/Context';
import SideBar from './components/sidebar/Sidebar';
import { useEffect } from 'react';

function App() {
  const { accessToken, userImg } = useContext(Context);
  const [logo, setLogo] = useState(null);
  useEffect(() => { 
    setLogo(userImg);
  }, [logo, userImg]);

  return (
    <BrowserRouter>
      {accessToken && accessToken !== null && <SideBar logo={logo}/>}
      <Routes>
        <Route path="/" element={<HomePage />} />
        {!accessToken && <Route path="/register" element={<Registration />} />}
        <Route path="/login" element={<Login />} />
        {accessToken && (
         <>
          <Route path="/countries" element={<Countrylist />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/userlist" element={<DashbordPage />} />
          <Route path="/state" element={<StateList />} />
          <Route path="/city" element={<CityList />} />
          <Route path="/inbox" element={<ChatContent loggedInimg={logo} />} />
         </>
        )}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
