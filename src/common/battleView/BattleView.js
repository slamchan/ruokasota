import React, { useEffect, useState } from 'react';
import FighterCard from '../components/FighterCard';
import { testFighter, testEnemyFighter, serverBaseUrl } from '../Constants';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Modal } from '@mui/material';

const BattleView = (props) => {
  BattleView.propTypes = {
    user: PropTypes.object.isRequired
  };
  const profile = localStorage.getItem('profile');
  const { user } = props;
  const [fighter, setFighter] = useState(undefined);
  const [battleResult, setBattleResult] = useState(undefined);
  const [resultsOpen, setResultsOpen] = useState(false);

  const doBattle = (enemyFighter) => {
    console.log(fighter, enemyFighter, user);
    axios
      .post(`${serverBaseUrl}/combat`, {
        attacker: fighter,
        defender: enemyFighter,
        profile: profile.trim()
      })
      .then((res) => {
        setBattleResult(res.data);
        localStorage.setItem('profile', res.data.profile);
        console.log(battleResult);
        console.log(battleResult.profile);
        setResultsOpen(true);
      });
  };

  return (
    <React.Fragment>
      <div className="h-full basis-4/6">
        <Modal
          open={resultsOpen}
          onClose={() => {
            setResultsOpen(false);
          }}
          className="flex justify-center items-center"
        >
          <div className="bg-slate-600 h-2/3 w-2/3 p-2">asd</div>
        </Modal>
        <div className=" flex-row h-fit flex">
          <FighterCard
            fighter={testFighter}
            buttonText="Valitse taistelija"
            onClick={setFighter}
          />
          <FighterCard
            fighter={testEnemyFighter}
            buttonText="Taistele!"
            onClick={doBattle}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default BattleView;
