import { db } from "../config/firebaseAdmin";

export const enableGoogleFit = async (req, res) => {
  try {
    const { googleFit } = req.body;
    const userId = req.user.uid;

    // Check if the userId and googleFit are provided in the request
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    if (googleFit === undefined) {
      return res.status(400).json({ message: "GoogleFit status is required." });
    }

    // Assuming you're storing user data in Firebase, update the Google Fit status
    const userRef = db.collection("users").doc(userId);

    // Add or update the googleFit field in the user's document
    await userRef.set({ googleFit }, { merge: true });

    // Send a success response
    res.status(200).json({ message: "Google Fit enabled!" });
  } catch (err) {
    console.log("Error enabling Google Fit in server:", err);
    res
      .status(500)
      .json({ message: "Server error while enabling Google Fit." });
  }
};

export const checkIfEnabledGoogleFit = async (req, res) => {
  const userId = req.user.uid;

  try {
    const userDoc = await db.collection("users").doc(userId).get();

    if (userDoc.exists) {
      const { googleFit } = userDoc.data();
      return res.status(200).json({ googleFitEnabled: !!googleFit });
    }

    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error("Error fetching Google Fit status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
