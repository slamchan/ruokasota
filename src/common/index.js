import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import BattleView from "./battleView/BattleView";
import ShopView from "./shopView/ShopView";
import FightersView from "./fightersView/FightersView";

const Home = () => {
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <div className="bg-cyan-200 h-screen flex flex-row">
        <div className="container basis-1/6">
          <Button
            variant="contained"
            className="w-full"
            onClick={() => navigate("/shop")}
          >
            Kauppa
          </Button>
          <Button
            variant="contained"
            className="w-full"
            onClick={() => navigate("/battle")}
          >
            Taistele
          </Button>
          <Button
            variant="contained"
            className="w-full"
            onClick={() => navigate("/fighters")}
          >
            Taistelijat
          </Button>
        </div>
        <Routes>
          <Route path="shop" element={<ShopView />} />
          <Route path="battle" element={<BattleView />} />
          <Route path="fighters" element={<FightersView />} />
        </Routes>
      </div>
    </React.Fragment>
  );
};

export default Home;
