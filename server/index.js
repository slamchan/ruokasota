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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

const PORT = process.env.PORT || 3001;
const secret = 'someamazingsecret';
const key = crypto.scryptSync(secret, 'GfG', 32);
const iv = crypto.scryptSync(secret, 'GfG', 16);

const encrypt = data => {
  if (!data) return;
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(JSON.stringify(data));
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
};

const deCrypt = data => {
  if (!data) return;
  const cryptedData = Buffer.from(data, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(cryptedData);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return JSON.parse(decrypted.toString('utf-8'));
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
  const { data } = await axios.get(`https://fineli.fi/fineli/api/v1/foods?q=${query}`).catch(e => new Error(e));
  res.send(createFighter(data));
});

app.get('/getProfile/:profile', async (req, res) => {
  res.send(deCrypt(req.params.profile));
});

app.post('/start', (req, res) => {
  const { name } = req.body;
  const profileData = { name, money: 2000, fighters: [] };
  // TODO save to db
  res.send({ profile: encrypt(profileData) });
});

app.post('/purchase', async (req, res) => {
  const { profile, fighter } = req.body;
  const profileData = deCrypt(profile);

  const { data } = await axios.get(`https://fineli.fi/fineli/api/v1/foods?q=${fighter.id}`).catch(e => new Error(e));
  const fetchedFighter = createFighter(data).filter(f => f.id === fighter.id)[0];
  if (fetchedFighter.price <= profileData.money) {
    profileData.money -= fetchedFighter.price;
    profileData.fighters.push(fetchedFighter);
  }

  // TODO save to db
  res.send({ profile: encrypt(profileData) });
});

app.post('/combat', (req, res) => {
  const { attacker, defender, profile } = req.body;
  const profileData = deCrypt(profile);
  console.log({ profileData });
  const hit = (attacker, defender) => {
    const damage = attacker.att * (1 - defender.def / 100);
    defender.hp -= damage;
    return { attacker: attacker.name, damage, hpLeft: defender.hp };
  };

  const createCombatLog = (attacker, defender) => {
    let turns = 0;
    const log = [];
    while (defender.hp > 0) {
      turns++;
      log.push({
        ...hit(attacker, defender),
        timeStamp: attacker.delay * turns,
      });
    }
    return { log, time: turns * attacker.delay };
  };

  const attackerLog = createCombatLog(attacker, defender);
  const defenderLog = createCombatLog(defender, attacker);

  // TODO save to db
  attackerLog.time < defenderLog.time
    ? (profileData.money += defender.price / 4)
    : (profileData.fighters = profileData.fighters.filter(fighter => fighter.id !== attacker.id));

  const combatLog = attackerLog.log.concat(defenderLog.log).sort((a, b) => a.time - b.time);

  res.send({ combatLog, profile: encrypt(profileData) });
});

app.delete('/eat', (req, res) => {
  const { profile, fighterId } = req.query;
  const profileData = deCrypt(profile);
  profileData.fighters = profileData.fighters.filter(f => f.id.toString() !== fighterId);

  // TODO save to db
  res.send({ profile: encrypt(profileData) });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
