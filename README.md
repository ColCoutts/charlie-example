## App to Filter Rules by Client Name

This guide shows how to create a simple app that filters rules by client name. The initialization of this project is very similar to the quickstart guide for [Node(Express)API:Authorization](https://auth0.com/docs/quickstart/backend/nodejs?download=true). You can follow the steps of this doc up to the ```Validate Access Tokens```. This should set you up with a configured API, I'd recommend adding the proper scopes at this point as well:

```read:messages```
```read:rules```

I would also recommend checking that the M2M application you've created has both your created API as well as the Auth0 Management API authorized, this can be found in the APIs tab in the Applications section.

![Applications Section](/images/image1.png)

At this point you can either download the configured sample from the [Node(Express)API:Authorization Guide](https://auth0.com/docs/quickstart/backend/nodejs?download=true) located at the top of the page, or you can download this repo and just update the necessary fields as needed. This app will require the following dependencies:

```npm i express cors request dotenv```

The dotenv isn't entirely necessary for this example but it's good habit to protect sensitive client information regardless.

## Setting up your application

At this point your ```server.js``` file should look something like this.

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
