import React from 'react';
import PropTypes from 'prop-types';
import { baseSpeed, speedMultiplier } from '../Constants';
import { Button } from '@mui/material';

const FighterCard = (props) => {
  FighterCard.propTypes = {
    fighter: PropTypes.object.isRequired,
    shop: PropTypes.bool,
    onClick: PropTypes.func
  };

  FighterCard.defaultPropTypes = {
    fighter: {},
    shop: false,
    onClick: undefined
  };

  const attackSpeed = (delay) => {
    return (baseSpeed / delay) * speedMultiplier;
  };

  const { fighter, shop, onClick } = props;

  const Tablecell = (props) => {
    Tablecell.propTypes = {
      content: PropTypes.string.isRequired
    };
    const { content } = props;
    return (
      <td className="border border-slate-600 pr-2 pl-2 bg-cyan-100">
        {content}
      </td>
    );
  };

  return (
    <div className="container w-60 p-2">
      <div className="container p-2 border border-slate-600 bg-cyan-100 h-full flex flex-col justify-between gap-1">
        <h1 className="font-bold basis-1/2">{fighter.name}</h1>
        <table className="table-auto border-separate item-spacing-1 border-slate-600 border bg-cyan-200">
          <tbody>
            <tr>
              <Tablecell content="Elämä:" />
              <Tablecell content={fighter.hp.toFixed(1)} />
            </tr>
            <tr>
              <Tablecell content="Hyökkäys:" />
              <Tablecell content={fighter.att.toFixed(1)} />
            </tr>
            <tr>
              <Tablecell content="Puolustus:" />
              <Tablecell content={fighter.def.toFixed(1)} />
            </tr>
            <tr>
              <Tablecell content="Hyökkäysnopeus:" />
              <Tablecell content={attackSpeed(fighter.delay).toFixed(1)} />
            </tr>
          </tbody>
        </table>
        {shop && (
          <Button
            variant="contained"
            onClick={() => {
              onClick(fighter);
            }}
          >
            {`Osta: ${fighter.price || 0}$` /*todo: remove || 0 */}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FighterCard;
