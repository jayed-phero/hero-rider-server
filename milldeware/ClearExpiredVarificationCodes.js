// Add this function to your controller
const clearExpiredVerificationCodes = async () => {
  try {
    // Find users with expired verification codes
    const usersWithExpiredCodes = await User.find({
      "validationCodes.expirationTime": { $lt: new Date() },
    });

    // Clear expired codes for each user
    usersWithExpiredCodes.forEach(async (user) => {
      user.validationCodes = user.validationCodes.filter(
        (code) => new Date(code.expirationTime) >= new Date()
      );

      await user.save();
    });

    console.log("Expired verification codes cleared successfully");
  } catch (error) {
    console.error("Error clearing expired verification codes:", error);
  }
};

// Call this function as needed, for example, using a scheduler or during specific actions
// Example: clearExpiredVerificationCodes();
