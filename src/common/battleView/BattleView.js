import React, { useState } from 'react';
import FighterCard from '../components/FighterCard';
import { serverBaseUrl } from '../Constants';
import { TextField, Modal } from '@mui/material';

import PropTypes from 'prop-types';
import axios from 'axios';

const BattleView = props => {
  BattleView.propTypes = {
    user: PropTypes.object.isRequired,
    setProfile: PropTypes.func.isRequired,
  };
  const profile = localStorage.getItem('profile');
  const { user, setProfile } = props;
  const [fighter, setFighter] = useState(undefined);
  const [enemy, setEnemy] = useState(undefined);

  const [enemyFighter, setEnemyFighter] = useState(undefined);
  const [battleResult, setBattleResult] = useState(undefined);
  const [resultsOpen, setResultsOpen] = useState(false);

  const searchEnemyFighter = async query => {
    await axios.get(`${serverBaseUrl}/getCarrots/${query}`).then(res => {
      setEnemy(res.data[0]);
    });
  };

  const doBattle = enemy => {
    console.log(fighter, enemy, user);
    axios
      .post(`${serverBaseUrl}/combat`, {
        attacker: fighter,
        defender: enemy,
        profile: profile.trim(),
      })
      .then(res => {
        setEnemyFighter(enemy);
        setBattleResult(res.data);
        localStorage.setItem('profile', res.data.profile);
        setProfile(res.data.profile);
        console.log(res.data);
        setResultsOpen(true);
      });
  };

  const findFirstDeath = () => {
    const deaths = battleResult?.combatLog.filter(x => x.hpLeft <= 0);
    return deaths?.sort((a, b) => a - b)[0];
  };

  return (
    <React.Fragment>
      <div className="h-full basis-4/6">
        {battleResult && fighter && enemyFighter && (
          <Modal
            open={resultsOpen}
            onClose={() => {
              setResultsOpen(false);
            }}
            className="flex justify-center items-center"
          >
            <div className="bg-white h-2/3 w-2/3 p-2 overflow-auto font-semibold flex flex-col">
              <div className="font-bold text-center border-b-black border-b-2">
                {`${findFirstDeath().attacker} voitti taistelun!`}
              </div>
              <div className="flex flex-row">
                <div>
                  {battleResult?.combatLog
                    ?.sort((a, b) => a.timeStamp - b.timeStamp)
                    .map(c => {
                      if (c.timeStamp <= findFirstDeath().timeStamp && c.attacker === fighter.name) {
                        return (
                          <div className=" p-2">
                            {`Hyökkääjä: ${c.attacker} -  Vahinko: ${c.damage.toFixed(2)} - Puolustajan (${
                              battleResult?.combatLog.find(x => x.attacker !== c.attacker).attacker
                            }) elämää jäljellä: ${c.hpLeft.toFixed(2)} - Aika taistelun alusta: ${c.timeStamp.toFixed(
                              2
                            )}s`}
                          </div>
                        );
                      } else return null;
                    })}
                </div>
                <div>
                  {battleResult?.combatLog
                    ?.sort((a, b) => a.timeStamp - b.timeStamp)
                    .map(c => {
                      if (
                        c.timeStamp <= findFirstDeath(battleResult?.combatLog).timeStamp &&
                        c.attacker === enemyFighter.name
                      ) {
                        <div className="p-2">
                          {`Hyökkääjä: ${c.attacker} -  Vahinko: ${c.damage.toFixed(2)} - Puolustajan (${
                            battleResult?.combatLog.find(x => x.attacker !== c.attacker).attacker
                          }) elämää jäljellä: ${c.hpLeft.toFixed(2)} - Aika taistelun alusta: ${c.timeStamp.toFixed(
                            2
                          )}s`}
                        </div>;
                      } else return null;
                    })}
                </div>
              </div>
            </div>
          </Modal>
        )}

        <div className="flex flex-row flex-wrap overflow-auto justify-start">
          {user?.fighters?.map(x => {
            return <FighterCard key={x.id} fighter={x} buttonText="Valitse taistelija" onClick={setFighter} />;
          })}

          <div>
            <TextField
              className="bg-white"
              label="Etsi"
              type="search"
              size="small"
              onChange={e => searchEnemyFighter(e.target.value)}
            />
            {enemy && <FighterCard fighter={enemy} buttonText="Taistele!" onClick={doBattle} />}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BattleView;
