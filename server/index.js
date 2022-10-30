// server/index.js

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const PORT = process.env.PORT || 3001;
const secret = 'abcdefg';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  next();
});

const encrypt = (data) => {
  const mykey = crypto.createCipher('aes-128-cbc', secret);
  let cryptedData = mykey.update(JSON.stringify(data), 'utf8', 'hex');
  return (cryptedData += mykey.final('hex'));
};

const deCrypt = (data) => {
  const mykey = crypto.createCipher('aes-128-cbc', secret);
  let cryptedData = mykey.update(JSON.stringify(data), 'utf8', 'hex');
  return (cryptedData += mykey.final('hex'));
};

// GET method route
app.get('/getCarrots/:query', async (req, res) => {
  const query = req.params.query;
  const data = await axios
    .get(`https://fineli.fi/fineli/api/v1/foods?q=${query}`)
    .then((res) => {
      const headerDate =
        res.headers && res.headers.date ? res.headers.date : 'no response date';
      console.log('Status Code:', res.status);
      console.log('Date in Response header:', headerDate);

      return res.data.map(({ name, energy, protein, fat, carbohydrate }) => ({
        name: name.fi,
        hp: energy,
        def: protein,
        delay: protein + fat + carbohydrate,
        att: carbohydrate,
        price: (protein + fat + carbohydrate) * energy
      }));
    })
    .catch((err) => {
      console.log('Error: ', err.message);
    });

  res.send(data);
});

app.get('/load', (req, res) => {
  res.send('GET request to the homepage');
});

// POST method route
app.post('/combat', (req, res) => {
  const { attacker, defender, profile } = req.body;
  const hit = (hitter, defender) => {
    const damage = hitter.att * (1 - defender.def);
    defender.hp -= damage;
    return { attacker: hitter.name, damage, hpLeft: defender.hp };
  };

  const createCombatLog = (attacker, defender) => {
    let turns = 0;
    const log = [];
    while (defender.hp > 0) {
      turns++;
      log.push({
        ...hit(attacker, defender),
        timeStamp: attacker.delay * turns
      });
    }
    return { log, time: turns * attacker.delay };
  };

  const attackerLog = createCombatLog(attacker, defender);
  const defenderLog = createCombatLog(defender, attacker);
  const combatLog = attackerLog.log
    .concat(defenderLog.log)
    .sort((a, b) => a.time - b.time);

  console.log({ combatLog });
  res.send({ combatLog });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
