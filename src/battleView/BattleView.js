import React from 'react';
import FighterCard from './components/FighterCard';

const BattleView = () => {
  const fighter = { energy: 33.0, carbs: 5.6, proteins: 0.6, fats: 0.2 };

  return (
    <React.Fragment>
      <div className="bg-cyan-300 h-screen basis-4/6">
        <FighterCard fighter={fighter} />
      </div>
    </React.Fragment>
  );
};

export default BattleView;
