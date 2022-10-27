import React from 'react';
import FighterCard from '../components/FighterCard';
import { testFighter, testEnemyFighter } from '../Constants';

const BattleView = () => {
  return (
    <React.Fragment>
      <div className="bg-cyan-300 h-screen basis-4/6 flex-row flex">
        <FighterCard fighter={testFighter} />
        <FighterCard fighter={testEnemyFighter} />
      </div>
    </React.Fragment>
  );
};

export default BattleView;
