## App to Filter Rules by Client Name

This guide shows how to create a simple app that filters rules by client name. The initialization of this project is very similar to the quickstart guide for [Node(Express)API:Authorization](https://auth0.com/docs/quickstart/backend/nodejs?download=true). You can follow the steps of this doc up to the ```Validate Access Tokens```. This should set you up with a configured API, I'd recommend adding the proper scopes at this point as well:

```read:messages```
```read:rules```

I would also recommend checking that the M2M application you've created has both your created API as well as the Auth0 Management API authorized, this can be found in the APIs tab in the Applications section.

![Applications Section](/images/image1.png)

At this point you can either download the configured sample from the [Node(Express)API:Authorization Guide](https://auth0.com/docs/quickstart/backend/nodejs?download=true) located at the top of the page, or you can download this repo and just update the necessary fields as needed. This app will require the following dependencies:

```npm i express cors request dotenv```

The dotenv isn't entirely necessary for this example but it's good habit to protect sensitive client information regardless.


## Rule Configuration

This is a very small step that will require you to go into any rules you have enabled for your application and add a commented out line with the corresponding application name. Its also important to place this line in the same place for each rule as well as giving the application name 1 space away from the forward slashes. For example:

![Rule example](/images/image2.png)

This step will make sense once we're calling the Management API where we can access this information later.

## Setting up your application

At this point your ```server.js``` file should look something like this. If you're working in a Node environment you can use ```npm start``` to start your server. This will also be useful to console.log what you're getting back from the API in case you run into any issues during this setup.

```
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
  res.json({
    'title': 'coming soon'
  })
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  return res.status(err.status).json({ message: err.message });
});

app.listen(3010);
console.log('Listening on http://localhost:3010');
```
We'll be placing this code in the public route for this example. Replicating authenticated requests is also possible through Postman which allow attaching Access Tokens to requests to validate the user.

```
  app.get('/api/public', function(req, res) {
    res.json({
      'title': 'coming soon'
    })
  });
```
I start by declaring empty arrays for each of my applications that I will populate with the corresponding rules. I will also create a presentational ```filteredClient``` object that will be used in the response body. Here for the options object populate the necessary fields with yoru specific app information.

```
  let APIExplorerArray = [];
  let DefaultAppArray = [];
  let TestAppArray = [];

  let filteredClient = {};

  let options = {
    method: 'POST',
    url: 'https://{your-tenant}.auth0.com/oauth/token',
    headers: {'content-type': 'application/json'},
    form: {
        grant_type: 'client_credentials',
        client_id: {app-client-id},
        client_secret: {app-client-secret},
        audience: 'https://{your-tenant}.auth0.com/api/v2/'
      }
    };

```

Next we will make our first request for an Access Token which we'll use later to fetch our rules. The Access Token gets passed in with string interpolation for the ```getRules``` object.

```
  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    let parsedData = JSON.parse(body)

    let getRules = {
      method: 'GET',
      url: 'https://{your-tenant}.auth0.com/api/v2/rules',
      audience: '{your-tenant}.auth0.com/api/v2/',
      headers: {'content-type': 'application/json',
                authorization: `Bearer ${parsedData.access_token}`
              }
    }
  }

```

Next we will make a request to the ```/api/v2/rules``` endpoint to receive all rules related to the tenant. Here I establish arrays for the ```ruleNameArray``` and ```clientNameFromScript``` that we will receive from the rule body.

```
    request(getRules, function(error, response, body) {
      if (error) throw new Error(error);
      let ruleData = JSON.parse(body)
      let clientNameFromScript = [];
      let ruleNameArray = [];
      let commentIndex = '';
    });

```
Now we can add the following logic to this request which will check if the name of the app is present within the specific rule, if so we populate the corresponding array with that rule name. We are also adding fields of the application name and corresponding array of rules with our ```filteredClient``` object.

```
      for(let i = 0; i < ruleData.length; i++) {

        let ruleScriptArray = ruleData[i].script.split(' ');
        commentIndex = ruleScriptArray.indexOf('//');
        clientNameFromScript.push(ruleScriptArray[commentIndex + 1]);
        ruleNameArray.push(ruleData[i].name);

        if(clientNameFromScript[i].includes('APIExplorer') && ruleData[i].script.includes('APIExplorer')) {
          APIExplorerArray.push(ruleData[i].name);
          filteredClient[clientNameFromScript[i]] = { id: clientNameFromScript[i], rules: [...APIExplorerArray] }
        }
        
        if(clientNameFromScript[i].includes('TestApp') && ruleData[i].script.includes('TestApp')) {
          TestAppArray.push(ruleData[i].name);
          filteredClient[clientNameFromScript[i]] = { id: clientNameFromScript[i], rules: [...TestAppArray] }
        }
        
        if(clientNameFromScript[i].includes('Default') && ruleData[i].script.includes('Default')) {
          DefaultAppArray.push(ruleData[i].name);
          filteredClient[clientNameFromScript[i]] = { id: clientNameFromScript[i], rules: [...DefaultAppArray] }
        }
      }

```
Finally, all we need to do is manipulate our filteredClient one more time and place it into our res body.

```
    let displayInfo = JSON.stringify(filteredClient);

      res.json({
        'Filtered App List': JSON.parse(displayInfo)
      });

```
At this point your entire app route should look something like this:

```

app.get('/api/public', function(req, res) {
  let APIExplorerArray = [];
  let DefaultAppArray = [];
  let TestAppArray = [];

  let filteredClient = {};

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

        console.log(clientNameFromScript, 'CLIENT NAME FROM SCRIPT');
        
        if(clientNameFromScript[i].includes('NameOfYourApp') && ruleData[i].script.includes('NameOfYourApp')) {
          APIExplorerArray.push(ruleData[i].name);
          filteredClient[clientNameFromScript[i]] = { id: clientNameFromScript[i], rules: [...APIExplorerArray] }
        }
        
        if(clientNameFromScript[i].includes('NameOfYourOtherApp') && ruleData[i].script.includes('NameOfYourOtherApp')) {
          TestAppArray.push(ruleData[i].name);
          filteredClient[clientNameFromScript[i]] = { id: clientNameFromScript[i], rules: [...TestAppArray] }
        }
        
        if(clientNameFromScript[i].includes('NameOfYourOtherOtherApp') && ruleData[i].script.includes('NameOfYourOtherOtherApp')) {
          DefaultAppArray.push(ruleData[i].name);
          filteredClient[clientNameFromScript[i]] = { id: clientNameFromScript[i], rules: [...DefaultAppArray] }
        }
      }

      let displayInfo = JSON.stringify(filteredClient);

      res.json({
        'Filtered App List': JSON.parse(displayInfo)
      });
    });
  });
});

```
To view the results of this code, go to your localhost server and append ```/api/public``` to see the formatted JSON of your application and rules.

![Filtered Response](/images/image3.png)
