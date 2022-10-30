// server/index.js

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

const PORT = process.env.PORT || 3001;
const secret = 'someamazingpassword';

const encrypt = data => {
  const mykey = crypto.createCipheriv('aes-128-cbc', secret);
  let cryptedData = mykey.update(JSON.stringify(data), 'utf8', 'hex');
  return (cryptedData += mykey.final('hex'));
};

const deCrypt = data => {
  const mykey = crypto.createCipheriv('aes-128-cbc', secret);
  let cryptedData = mykey.update(JSON.stringify(data), 'utf8', 'hex');
  return (cryptedData += mykey.final('hex'));
};

const createFighter = unhandledFoods =>
  unhandledFoods.map(({ id, name, energy, protein, fat, carbohydrate }) => ({
    id,
    name: name.fi,
    hp: energy,
    def: protein,
    delay: protein + fat + carbohydrate,
    att: carbohydrate,
    price: (protein + fat + carbohydrate) * energy,
  }));

// GET method route
app.get('/getCarrots/:query', async (req, res) => {
  const query = req.params.query;

  const data = await axios
    .get(`https://fineli.fi/fineli/api/v1/foods?q=${query}`)
    .then(res => createFighter(res.data))
    .catch(e => new Error(e));

  res.send(data);
});

app.post('/start', (req, res) => {
  const { name } = req.body;
  const profileData = { name, money: 100, fighters: [] };
  // TODO save to db
  res.send({ profile: encrypt(profileData) });
});

app.post('/purchase', async (req, res) => {
  const { profile, fighter } = req.body;
  const profileData = deCrypt(profile);

  const fighters = await axios
    .get(`https://fineli.fi/fineli/api/v1/foods?q=${fighter.id}`)
    .then(res => createFighter(res.data).filter(f => f.id === fighter.id))
    .catch(e => new Error(e));
  if (fighters[0].price <= profile.money) {
    profileData.fighters.push(fighters[0]);
  }

  // TODO save to db
  res.send({ profile: encrypt(profileData) });
});

app.delete('/eat', (req, res) => {
  const { profile, fighter } = req.params;
  const profileData = deCrypt(profile);
  profileData.fighters.filter(f => f.name !== fighter.name);

  // TODO save to db
  res.send({ profile: encrypt(profileData) });
});

// POST method route
app.post('/combat', (req, res) => {
  const { attacker, defender, profile } = req.body;

  const profileData = deCrypt(profile);

  const hit = (attacker, defender) => {
    const damage = attacker.att * (1 - defender.def);
    defender.hp -= damage;
    return { attacker: attacker.name, damage, hpLeft: defender.hp };
  };

  const createCombatLog = (attacker, defender) => {
    let turns = 0;
    const log = [];
    while (defender.hp > 0) {
      turns++;
      log.push({ ...hit(attacker, defender), timeStamp: attacker.delay * turns });
    }
    return { log, time: turns * attacker.delay };
  };

  const attackerLog = createCombatLog(attacker, defender);
  const defenderLog = createCombatLog(defender, attacker);

  // TODO save to db
  attackerLog.time < defenderLog.time
    ? (profileData.money += defender.price / 4)
    : profileData.fighters.filter(fighter => fighter.name !== attacker.name);

  const combatLog = attackerLog.log.concat(defenderLog.log).sort((a, b) => a.time - b.time);

  res.send({ combatLog, profile: encrypt(profileData) });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
