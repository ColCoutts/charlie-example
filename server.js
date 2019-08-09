const express = require('express');
const app = express();
const cors = require('cors');
const request = require('request');


require('dotenv').config();

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file';
}

const corsOptions =  {
  origin: 'http://localhost:3000'
};

app.use(cors(corsOptions));

app.get('/api/public', function(req, res) {
  let APIExplorerObj = new Map();
  let DefaultAppObj = new Map();
  let TestAppObj = new Map();

  let displayAPIExplorer = '';
  let displayDefault = '';
  let displayTest = '';

  let APIExplorerArray = [];
  let DefaultAppArray = [];
  let TestAppArray = [];

  let filteredClient = {};
  let ArrayForObj = [];

  let options = {
    method: 'POST',
    url: 'https://management-exercise.auth0.com/oauth/token',
    headers: {'content-type': 'application/json'},
    form: {
        grant_type: 'client_credentials',
        client_id: 'uEtn1qd7KjrlPRSZYtWBFKTFiCq4lEQg',
        client_secret: '7CvxeFMx_P_P3kTB1kKz2rL76nUr8Jz0ls1txvDNuDPfxo3hBVzg8UrLLPVyxN5_',
        audience: 'https://management-exercise.auth0.com/api/v2/'
      }
    };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    let parsedData = JSON.parse(body)

    let getRules = {
      method: 'GET',
      url: 'https://management-exercise.auth0.com/api/v2/rules',
      audience: 'https://management-exercise.auth0.com/api/v2/',
      headers: {'content-type': 'application/json', authorization: `Bearer ${parsedData.access_token}`}
    }

    request(getRules, function(error, response, body) {
      if (error) throw new Error(error);
      let ruleData = JSON.parse(body)
      let clientNameFromScript = [];
      let ruleNameArray = [];
      let commentIndex = '';
      
      for(let i = 0; i < ruleData.length; i++) {
        let ruleScriptArray = ruleData[i].script.split(' ');
        commentIndex = ruleScriptArray.indexOf('//');
        clientNameFromScript.push(ruleScriptArray[commentIndex + 1]);
        ruleNameArray.push(ruleData[i].name);
        
        if(clientNameFromScript[i].includes('APIExplorer') && ruleData[i].script.includes('APIExplorer')) {
          APIExplorerArray.push(ruleData[i].name);
          APIExplorerObj.set(clientNameFromScript[i], APIExplorerArray);
          
          // APINormablObj['app'] = { app2: clientNameFromScript[i], APIExplorerArray };
          filteredClient['app'] = { id: clientNameFromScript[i], rules: [...APIExplorerArray] }
          
          ArrayForObj.push({ id: clientNameFromScript[i], rules: APIExplorerArray });
        }
        
        if(clientNameFromScript[i].includes('TestApp') && ruleData[i].script.includes('TestApp')) {
          TestAppArray.push(ruleData[i].name);
          TestAppObj.set(clientNameFromScript[i], TestAppArray);
          
          filteredClient['app2'] = { id: clientNameFromScript[i], rules: [...TestAppArray] }
        }
        
        if(clientNameFromScript[i].includes('Default') && ruleData[i].script.includes('Default')) {
          DefaultAppArray.push(ruleData[i].name);
          DefaultAppObj.set(clientNameFromScript[i], DefaultAppArray);

          filteredClient['app3'] = { id: clientNameFromScript[i], rules: [...DefaultAppArray] }
        }
      }

      displayAPIExplorer = JSON.stringify([...APIExplorerObj]);
      displayDefault = JSON.stringify([...DefaultAppObj]);
      displayTest = JSON.stringify([...TestAppObj]);
      // filteredClient['rule list'] = APINormablObj;
      // console.log('FIlteredClient', filteredClient);
      console.log('FILTERED CLIENT', filteredClient);

      res.json({
        'APP 1': JSON.parse(displayAPIExplorer),
        'APP 2': JSON.parse(displayTest),
        'APP 3': JSON.parse(displayDefault)
      });

    });
  });
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  return res.status(err.status).json({ message: err.message });
});

app.listen(3010);
console.log('Listening on http://localhost:3010');
