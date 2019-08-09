## App to Filter App and Rules

This guide shows how to create a simple app that filters rules by client name. The initialization of this project is very similar to the quickstart guide for [Node(Express)API:Authorization](https://auth0.com/docs/quickstart/backend/nodejs?download=true). You can follow the steps of this doc up to the ```Validate Access Tokens```. This should set you up with a configured API, I'd recommend adding the proper scopes at this point as well:

```read:messages```
```read:rules```

I would also recommend checking that the M2M application you've created has both your created API as well as the Auth0 Management API authorized, this can be found in the APIs tab in the Applications section.

[Applications Section]('/images/image1.png')
