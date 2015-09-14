Wrist Warriors
===========

## Endpoints

**POST /api/v1/user**
* requires payload: typeOfCreate ('fitbitGhost' or 'real').
* optional payload: fitbitUserId, fitbitAccessToken, fitbitAccessTokenSecret, email, password.
* Creates a user best of the typeOfCreate. Returns the user.

**Post /login**
* requires payload: typeOfLogin ('fitbitGhost' or 'real'), fitbitAccessTokenSecret.
* the app will need to store the old token secret and login with that THEN update the token secret. if you update first you won't be able to login as the server doesn't know the new token. (can't update user yet).
* returns the user.


===========


you will need the config.js file otherwise this will not work at all.
