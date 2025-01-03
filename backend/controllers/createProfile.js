import { db } from '../config/firebaseAdmin.js'; // Assuming this is your Firebase Admin SDK setup

export const createProfile = async (req, res) => {
  const {
    item1, item2, item3, item4, item5, item6, item7,
    createdAt, lastUpdated
  } = req.body;

  const userId = req.user.uid; // Extract the userId from the request
  console.log(userId);

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    // Ensure createdAt and lastUpdated are set to valid timestamps
    const createdTimestamp = new Date(createdAt).toISOString();
    const updatedTimestamp = new Date(lastUpdated).toISOString();

    // Create a reference to the user's document using their UID
    const userRef = db.collection("users").doc(userId); // Use the user's UID as the document ID

    // Set the profile data under the 'users' collection
    await userRef.set({
      name,
      age,
      height,
      weight,
      gender,
      exercise,
      sleep,
      preferences,
      createdAt: createdTimestamp,
      lastUpdated: updatedTimestamp
    });

    // Send success response
    res.status(200).json({ message: "Profile created successfully" });

  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
