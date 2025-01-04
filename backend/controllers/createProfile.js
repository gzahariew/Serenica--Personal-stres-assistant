import { db } from "../config/firebaseAdmin.js"; // Assuming this is your Firebase Admin SDK setup

export const createProfile = async (req, res) => {
  const {
    name,
    age,
    height,
    weight,
    gender,
    exercise,
    sleep,
    preferences,
    createdAt,
  } = req.body;

  const userId = req.user.uid; // Extract the UID from the request
  const email = req.user.email; // Extract the email from the request (from Firebase Authentication)

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    // Use current timestamp if createdAt is not provided
    const createdTimestamp = createdAt ? new Date(createdAt).toISOString() : new Date().toISOString();

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
      email: email, // The email is extracted from Firebase Authentication, no need to pass it from frontend
      createdAt: createdTimestamp,
    });

    // Send success response
    res.status(200).json({ message: "Profile created successfully" });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
