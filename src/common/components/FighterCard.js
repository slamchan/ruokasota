import React from "react";
import PropTypes from "prop-types";
import { baseSpeed, speedMultiplier } from "../Constants";

const FighterCard = (props) => {
  FighterCard.propTypes = {
    fighter: PropTypes.object.isRequired,
  };

  const attackSpeed = (carbs, proteins, fats) => {
    const delay = carbs + proteins + fats;
    return (baseSpeed / delay) * speedMultiplier;
  };

  const { fighter } = props;
  const atk = fighter.carbs;
  const hp = fighter.energy;
  const def = fighter.proteins;
  const spd = attackSpeed(
    fighter.carbs,
    fighter.proteins,
    fighter.fats
  ).toFixed(1);

  const Tablecell = (props) => {
    Tablecell.propTypes = {
      content: PropTypes.string.isRequired,
    };
    const { content } = props;
    return (
      <td className="border border-slate-600 pr-2 pl-2 bg-cyan-100">
        {content}
      </td>
    );
  };

  return (
    <div className="container w-fit p-2">
      <div className="container p-2 border border-slate-600 bg-cyan-100">
        <h1 className="font-bold">{fighter.name}</h1>
        <table className="table-auto border-separate item-spacing-1 border-slate-600 border bg-cyan-200">
          <tbody>
            <tr>
              <Tablecell content="Elämä:" />
              <Tablecell content={hp} />
            </tr>
            <tr>
              <Tablecell content="Hyökkäys:" />
              <Tablecell content={atk} />
            </tr>
            <tr>
              <Tablecell content="Puolustus:" />
              <Tablecell content={def} />
            </tr>
            <tr>
              <Tablecell content="Hyökkäysnopeus:" />
              <Tablecell content={spd} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FighterCard;
