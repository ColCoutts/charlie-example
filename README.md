## App to Filter Rules by Client Name

This guide shows how to create a simple app that filters rules by client name. The initialization of this project is very similar to the quickstart guide for [Node(Express)API:Authorization](https://auth0.com/docs/quickstart/backend/nodejs?download=true). You can follow the steps of this doc up to the ```Validate Access Tokens```. This should set you up with a configured API, I'd recommend adding the proper scopes at this point as well:

```read:messages```
```read:rules```

I would also recommend checking that the M2M application you've created has both your created API as well as the Auth0 Management API authorized, this can be found in the APIs tab in the Applications section.

![Applications Section](/images/image1.png)

At this point you can either download the configured sample from the [Node(Express)API:Authorization Guide](https://auth0.com/docs/quickstart/backend/nodejs?download=true) located at the top of the page, or you can download this repo and just update the necessary fields as needed. This app will require the following dependencies:

```npm i express cors request dotenv```

The dotenv isn't entirely necessary for this example but it's good habit to protect sensitive client information regardless.

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
