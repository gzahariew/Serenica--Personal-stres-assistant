import GoogleFit, { Scopes } from 'react-native-google-fit';

const options = {
  scopes: [
    Scopes.FITNESS_ACTIVITY_READ,
    Scopes.FITNESS_SLEEP_READ,
    Scopes.FITNESS_HEART_RATE_READ,
    Scopes.FITNESS_BODY_READ,
  ],
};

GoogleFit.authorize(options)
  .then(authResult => {
    if (authResult.success) {
      console.log("Authorized:", authResult);
    } else {
      console.log("Failed to authorize:", authResult.message);
    }
  })
  .catch(err => console.log("Authorization error:", err));
