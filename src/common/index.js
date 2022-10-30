import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import BattleView from './battleView/BattleView';
import ShopView from './shopView/ShopView';
import FightersView from './fightersView/FightersView';
import axios from 'axios';
import { serverBaseUrl } from './Constants';

const Home = () => {
  const [profile, setProfile] = useState(localStorage.getItem('profile'));
  const [user, setUser] = useState({});
  useEffect(() => {
    if (!profile) {
      console.log('Creating new profile');
      axios.post(`${serverBaseUrl}/start`, { name: 'dev' }).then((res) => {
        setProfile(res.data.profile);
        localStorage.setItem('profile', res.data.profile);
      });
    }
  }, []);

  useEffect(() => {
    if (profile) {
      axios.get(`${serverBaseUrl}/getProfile/${profile}`).then((res) => {
        setUser(res.data);
      });
    }
  }, [profile]);

  console.log(user);

  const navigate = useNavigate();
  return (
    <React.Fragment>
      <div className="bg-slate-600 h-screen flex flex-row">
        <div className="container basis-1/6 border-r-2 border-slate-700">
          <Button
            variant="contained"
            className="w-full"
            onClick={() => navigate('/shop')}
          >
            Kauppa
          </Button>
          <Button
            variant="contained"
            className="w-full"
            onClick={() => navigate('/battle')}
          >
            Taistele
          </Button>
          <Button
            variant="contained"
            className="w-full"
            onClick={() => navigate('/fighters')}
          >
            Taistelijat
          </Button>
        </div>
        <Routes>
          <Route
            path="shop"
            element={<ShopView user={user} setProfile={setProfile} />}
          />
          <Route
            path="battle"
            element={<BattleView user={user} setProfile={setProfile} />}
          />
          <Route
            path="fighters"
            element={<FightersView user={user} setProfile={setProfile} />}
          />
        </Routes>
      </div>
    </React.Fragment>
  );
};

export default Home;
