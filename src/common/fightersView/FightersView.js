import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import FighterCard from '../components/FighterCard';
import axios from 'axios';
import { serverBaseUrl } from '../Constants';

const FightersView = props => {
  FightersView.propTypes = {
    user: PropTypes.object.isRequired,
    setProfile: PropTypes.func.isRequired,
  };
  const [fighters, setFighters] = useState([]);
  const { user, setProfile } = props;
  useEffect(() => {
    setFighters(user.fighters);
  }, [user]);
  useEffect(() => {
    setProfile(localStorage.getItem('profile'));
  }, [fighters]);
  const profile = useMemo(() => {
    return localStorage.getItem('profile');
  }, []);
  const eatFighter = fighter => {
    axios
      .delete(`${serverBaseUrl}/eat`, {
        params: { profile, fighterId: fighter.id },
      })
      .then(res => {
        localStorage.setItem('profile', res.data.profile);
        setFighters([]);
      });
  };
  return (
    <React.Fragment>
      <div className="basis-5/6 h-full flex-col flex">
        <div className="bg-white flex gap-2 p-2 font-semibold">Omat taistelijat</div>
        <div className="flex flex-row flex-wrap overflow-auto justify-start">
          {fighters?.map(fighter => (
            <FighterCard fighter={fighter} buttonText="Syö taistelija" key={fighter.id} onClick={eatFighter} />
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default FightersView;
