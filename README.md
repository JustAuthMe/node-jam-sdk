# JustAuthMe Node SDK

## Install
``` 
npm i node-jam-sdk
```


## Usage :
### 1. Import
```javascript
const { JamSDK } = require("node-jam-sdk");
```
Or using typescript :
```typescript
import { JamSDK } from "node-jam-sdk"
```

### 2. Configure
```javascript
const jam = new JamSDK("<appId>", "<redirectUrl>", "<apiSecret>");
```

### 3. Show login page to user :
You can generate the url to the login page using 
```javascript 
jam.generateLoginUrl() 
```

If you're using React for your frontend, you can use the [react-jam-button](https://www.npmjs.com/package/react-jam-button) component.


### 4. Authenticate the user
When the users authenticate using the app, they will be redirected to your redirectUrl with an accessToken in the uri.

`getUserInfos` will return the UserData through a Promise (e.g: jam_id, email, firstname, lastname, etc...)

```javascript
jam.getUserInfos(accessToken).then(value => {
    // log user in using userData
}).catch(error => {
    // handle error
})

```

### Example with express :
```javascript
const { JamSDK } = require("node-jam-sdk");

const jam = new JamSDK("<appId>", "<redirectUrl>", "<apiSecret>");
const express = require('express');
const app = express();

app.get('/auth-jam', function(req, res){
    const accessToken =  req.query.access_token;

    jam.getUserInfos(accessToken).then(userData => {
        // if userData.jam_id exists in your database, you have to login that user.
        // else : you have to save userData.jam_id into your database along with the data from userData (email etc)
    }).catch(error => {
        // handle error
    })

});

app.listen(3000);

```

### Error handling :
The getUserInfos promise may reject. There are different types of error :
|Error|Reason|
|---|---|
|JamBadRequestError | Access-Token and API Secret are required. Please contact support@justauth.me.|
|JamUnauthorizedError | Api Secret is invalid|
|JamNotFoundError | No such Access-Token|
|JamInternalServerError | This should not happen. Please contact support@justauth.me if it does.|
|JamUnknownError | This should not happen. Please contact support@justauth.me if it does|
