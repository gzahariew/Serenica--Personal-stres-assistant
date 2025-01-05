import auth from '@react-native-firebase/auth';
import apiClient from '@/instances/authInstance';

const checkUserProfile = async (router: any) => {
  try {
    const currentUser = auth().currentUser;
    
    if (!currentUser) {
      router.push('../app/signIn');
      return false;
    }

    const response = await apiClient.get('/users/userProfile');

    if (response.data.setupRequired) {
      router.push('/SetUp');
      return true;
    }

    return true;
  } catch (err: any) {
    if (err.message === "Network Error" || err.response?.status === 500) {
      return false;
    }
    if (err.response?.status === 404) {
      return false;
    }
    return false;
  }
};

export default checkUserProfile;







