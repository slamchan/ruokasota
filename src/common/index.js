import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import BattleView from './battleView/BattleView';
import ShopView from './shopView/ShopView';
import FightersView from './fightersView/FightersView';
import axios from 'axios';
import { serverBaseUrl } from './Constants';

const Home = () => {
  const [profile, setProfile] = useState(
    JSON.parse(localStorage.getItem('profile'))
  );
  useEffect(() => {
    if (!profile) {
      console.log('Creating new profile');
      axios.post(`${serverBaseUrl}/start`, { name: 'dev' }).then((res) => {
        setProfile(res.data.profile);
        localStorage.setItem('profile', JSON.stringify(res.data.profile));
      });
    }
  }, []);
  const user = {}; //temp

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
          <Route path="shop" element={<ShopView user={user} />} />
          <Route path="battle" element={<BattleView user={user} />} />
          <Route path="fighters" element={<FightersView user={user} />} />
        </Routes>
      </div>
    </React.Fragment>
  );
};

export default Home;
