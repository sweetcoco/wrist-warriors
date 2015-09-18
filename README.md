Wrist Warriors
===========

## Endpoints

**POST /api/v1/user**
* Create the user.
* requires payload: typeOfCreate: "fitbit".
* requires payload: fitbitToken.

**PUT /api/v1/user**
* update the fitbit token. Must have session authenticated.
* requires payload: fitbitToken.

**POST /login**
* returns the user.
* requires payload: typeOfLogin "fitbit".
* requires payload: fitbitToken.

**POST /logout**
* destroys the session.
* returns `{message: "logged out"}` 

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
