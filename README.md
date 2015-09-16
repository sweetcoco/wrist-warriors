Wrist Warriors
===========

## Endpoints

**POST /api/v1/user**
* requires payload: typeOfCreate: "fitbit".
* requires payload: fitbitToken.
* Create the user.

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
The user cannot be updated yet.

===========


you will need the config.js file otherwise this will not work at all.
