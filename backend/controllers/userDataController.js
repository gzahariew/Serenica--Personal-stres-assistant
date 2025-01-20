import { db } from "../config/firebaseAdmin.js"; // Assuming this is your Firebase Admin SDK setup

export const getUserData = async (req, res) => {
  const userId = req.user.uid; // Extract the UID from the request

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    // Create a reference to the user's document using their UID
    const userRef = db.collection("users").doc(userId);

    // Fetch the user's document
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User data not found." });
    }

    // Return the user data as JSON
    res.status(200).json(userDoc.data());
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
