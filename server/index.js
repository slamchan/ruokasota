// server/index.js

const express = require('express');
const axios = require('axios');

const PORT = process.env.PORT || 3001;

const app = express();

// GET method route
app.get('/getCarrots/:query', async (req, res) => {
  const query = req.params.query;
  const data = await axios
    .get(`https://fineli.fi/fineli/api/v1/foods?q=${query}`)
    .then(res => {
      const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
      console.log('Status Code:', res.status);
      console.log('Date in Response header:', headerDate);

      return res.data.map(({ name, energy, protein, fat, carbohydrate }) => ({
        name: name.fi,
        energy,
        protein,
        fat,
        carbohydrate,
      }));
    })
    .catch(err => {
      console.log('Error: ', err.message);
    });

  res.send(data);
});

app.get('/load', (req, res) => {
  res.send('GET request to the homepage');
});

// POST method route
app.post('/combat', (req, res) => {
  const { attacker, defender } = req;
  const hit = (hitter, defender) => {
    const damage = hitter.att * defender.def;
    defender.hp -= damage;
    return { damage, hpLeft: defender.hp };
  };

  const victoryTime = (attacker, defender) => {
    let turns = 0;
    const combatLog = [];
    while (attacker.hp <= 0) {
      turns++;
      combatLog.push({ ...hit(attacker, defender), timeStamp: attacker.delay * turns });
    }
    return { combatLog, time: turns * attacker.delay };
  };

  const attackerLog = victoryTime(attacker, defender);
  const defenderLog = victoryTime(defender, attacker);
  const combatLog = attackerLog.combatLog.concat(defenderLog).sort((a, b) => a.time - b.time);

  res.send({ combatLog });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
