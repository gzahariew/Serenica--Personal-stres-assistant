import GoogleFit, { Scopes } from 'react-native-google-fit';

// This is where you'll define the permissions/scopes required for reading the data
const options = {
    scopes: [
      Scopes.FITNESS_HEART_RATE_READ,       // Heart Rate & HRV
      Scopes.FITNESS_BODY_READ,            // SpO2 & Skin Temperature
    //   Scopes.FITNESS_RESPIRATORY_RATE_READ // Respiratory Rate
    ],
  };
  

// Authorize Google Fit
GoogleFit.authorize(options)
  .then(() => {
    console.log('Google Fit authorized!');
  })
  .catch((error) => {
    console.error('Google Fit authorization failed', error);
  });
