import React, { useState } from 'react';
import FighterCard from '../components/FighterCard';
import { serverBaseUrl } from '../Constants';
import axios from 'axios';
import { TextField, Button } from '@mui/material';
import PropTypes from 'prop-types';

const ShopView = (props) => {
  ShopView.propTypes = {
    user: PropTypes.object.isRequired
  };
  const { user } = props;
  const [fighters, setFighters] = useState([]);
  const [query, setQuery] = useState('');
  const searchFighters = () => {
    console.log('fetchFighters');
    axios
      .get(`${serverBaseUrl}/getCarrots/${query}`)
      .then((res) => setFighters(res.data));
  };
  const buyFighter = (fighter) => {
    console.log('Ostettu: ', fighter);
  };
  return (
    <React.Fragment>
      <div className="basis-5/6 h-full flex-col flex">
        <div className="bg-white flex gap-2 p-2">
          <TextField
            id="nameSearch"
            label="Etsi"
            variant="outlined"
            type="search"
            size="small"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
          <Button
            variant="contained"
            onClick={() => {
              searchFighters();
            }}
          >
            Etsi
          </Button>
          <div className="p-2 font-semibold">{`Raha: ${user.money}$`}</div>
        </div>
        <div className="flex flex-row flex-wrap overflow-auto justify-start">
          {fighters.map((fighter) => {
            return (
              <FighterCard
                fighter={fighter}
                view="shop"
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

export default ShopView;
