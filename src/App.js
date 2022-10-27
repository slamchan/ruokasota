import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from './common/index';

const App = () => {
  const [showBattleView, setShowBattleView] = useState(true); // todo: set to false
  const [showShopView, setShowShopView] = useState(false);

  return (
    <React.Fragment>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Home />} />
          </Routes>
        </BrowserRouter>
    </React.Fragment>
  );
};

export default App;
