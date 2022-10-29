import React from 'react';
import FighterCard from '../components/FighterCard';
import { testFighter, testEnemyFighter } from '../Constants';
import PropTypes from 'prop-types';

const BattleView = () => {
  BattleView.propTypes = {
    user: PropTypes.object.isRequired
  };
  return (
    <React.Fragment>
      <div className="bg-cyan-300 h-full basis-4/6">
        <div className=" flex-row h-fit flex">
          <FighterCard fighter={testFighter} />
          <FighterCard fighter={testEnemyFighter} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default BattleView;
