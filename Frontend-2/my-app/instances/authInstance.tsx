import axios from 'axios';
import auth from '@react-native-firebase/auth';
import API_BASE_URL from "@/config/apiConfig";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}`, 
});

// Attach the token to every request
apiClient.interceptors.request.use(async (config) => {
  const currentUser = auth().currentUser;

  if (currentUser) {
    const idToken = await currentUser.getIdToken(true); // Get the token
    config.headers.Authorization = `Bearer ${idToken}`;
  }

  return config;
}, (error) => Promise.reject(error));

export default apiClient;
