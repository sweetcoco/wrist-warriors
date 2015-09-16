Wrist Warriors
===========

## Endpoints

**POST /api/v1/user**
* requires payload: typeOfCreate: "fitbit".
* requires payload: fitbitToken.
* Create the user.

**PUT /api/v1/user**
* requires payload: fitbitToken.
* update the fitbit token. Must have session authenticated.

**POST /login**
* requires payload: typeOfLogin "fitbit".
* requires payload: fitbitToken.
* returns the user.

**fitbitToken:**
```
{
    token: {
        token: {
            access_token: String,
            expires_in: Number,
            refresh_token: String,
            scope: String,
            token_type: String,
            user_id: String,
            expires_at: String
        }
    }
}
```

The session is set upon creation and login... cannot logout yet. lol.

===========


you will need the config.js file otherwise this will not work at all.
