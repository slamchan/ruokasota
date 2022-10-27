import React, { useState } from 'react';
import { Button } from '@mui/material';
import BattleView from './battleView/BattleView';

const App = () => {
  const [showBattleView, setShowBattleView] = useState(true); // todo: set to false

  return (
    <React.Fragment>
      <div className="bg-cyan-200 h-screen flex flex-row">
        <div className="container basis-1/6">
          <Button variant="contained" className="w-full">
            Kauppa
          </Button>
          <Button
            variant="contained"
            className="w-full"
            onClick={() => setShowBattleView(!showBattleView)}
          >
            Taistele
          </Button>
          <Button variant="contained" className="w-full">
            Taistelijat
          </Button>
        </div>
        {showBattleView && <BattleView />}
      </div>
    </React.Fragment>
  );
};

export default App;
