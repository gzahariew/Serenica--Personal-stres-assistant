export const getUserData = (req, res) => {
    const uid = req.user.uid; // Retrieved from authenticate middleware
    res.status(200).json({ message: 'User data retrieved successfully', uid });
  };
  
  export const updateUserProfile = (req, res) => {
    const uid = req.user.uid;
    const { name, preferences } = req.body;
  
    // Business logic here
    res.status(200).json({ message: 'User profile updated', uid, name, preferences });
  };
  