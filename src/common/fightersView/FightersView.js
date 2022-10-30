import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FightersView = (props) => {
  FightersView.propTypes = {
    user: PropTypes.object.isRequired
  };
  const { user } = props;
  const [fighters, setFighters] = useState([]);
  return (
    <React.Fragment>
      <div className="basis-5/6 h-full flex-col flex">
        <div className="bg-white flex gap-2 p-2 font-semibold">
          Omat taistelijat
        </div>
        <div className="flex flex-row flex-wrap overflow-auto justify-start">
          {fighters.map((fighter) => {
            return (
              <FighterCard
                fighter={fighter}
                buttonText="Syö taistelija"
                onClick={buyFighter}
                key={fighter.name}
              />
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default FightersView;
