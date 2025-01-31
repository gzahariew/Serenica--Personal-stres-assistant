After extensive troubleshooting, I’ve decided to discontinue this project due to persistent issues accessing Google Fit data. Despite following the documentation, ensuring permissions were set correctly, and testing in an emulator, all attempts to retrieve heart rate, sleep, and activity data resulted in empty arrays.

Given that I only have access to an iPhone and Apple Watch, Google Fit was my last resort for cross-platform health tracking. Unfortunately, the API limitations in my testing environment made it impossible to proceed without native functionality, which requires a full Play Store deployment.

While I’ve learned a lot from this project, continuing without reliable data wouldn't be user-friendly or practical. Instead, I’ll be exploring other technologies—perhaps even C/C++ for future projects.

Thanks to everyone who followed along! If you’ve encountered and solved similar issues, feel free to reach out.

# Serenica 🌿  
*A stress management companion leveraging Google Fit.*
## 🚀 Project Status  
**Early Development**  
Serenica is in its initial stages of development. Many features are under construction, and feedback is welcome to shape the app's future.
---
## 📖 About  
Serenica aims to help users monitor and manage their stress levels by analyzing health data from Google Fit. The app calculates a stress index based on metrics such as heart rate and sleep data.  
**Current Features:**  
- Authorize and fetch health metrics from Google Fit.
- Display a basic stress index for the user.  
**Planned Features:**  
- Beautiful charts to visualize stress patterns.  
- Personalized recommendations based on user data.  
- Local and backend data caching for optimal performance.  
- Robust privacy compliance (GDPR).  
---
## 🛠️ Tech Stack  
| **Frontend** | **Backend** | **Database** | **Other** |
|--------------|-------------|--------------|-----------|
| React Native | Node.js     | Firestore    | Firebase Admin SDK |
| TypeScript   | Express.js  | MMKV (local storage) | Google Fit API |
---
## 🛡️ Privacy and Security  
User data privacy is a priority. I am working toward full compliance with GDPR and other privacy standards.  
