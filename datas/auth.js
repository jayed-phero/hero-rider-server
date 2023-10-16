  // Registration endpoint with email verification
  app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await usersCollection.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Generate a random verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        // Store the verification code along with the user's email
        verificationCodes[email] = {
            code: verificationCode,
            timestamp: Date.now(),
        };

        // Send an email with the verification code
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Account Verification Code',
            text: `Your verification code is: ${verificationCode}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to send verification code email' });
            }

            res.json({ msg: 'Verification code sent successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to verify the received code and activate the user's account
app.post('/verify-account', async (req, res) => {
    const { email, code } = req.body;

    try {
        // Check if the verification code is correct and not expired (e.g., within 5 minutes)
        const storedCode = verificationCodes[email];

        if (!storedCode || storedCode.code !== code || Date.now() - storedCode.timestamp > 5 * 60 * 1000) {
            return res.status(400).json({ error: 'Invalid or expired verification code' });
        }

        // Mark the user account as verified in the database
        const result = await usersCollection.updateOne({ email }, { $set: { isVerified: true } });

        // Remove the used verification code
        delete verificationCodes[email];

        res.json({ result, msg: 'Account verification successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// // Registration endpoint
// app.post('/register', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // Check if the user already exists
//         const existingUser = await usersCollection.findOne({ email });

//         if (existingUser) {
//             return res.status(400).json({ msg: 'User already exists' });
//         }

//         // Hash the password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create a new user
//         const newUser = { email, password: hashedPassword };
//         const result = await usersCollection.insertOne(newUser);

//         res.json({ result, msg: 'User registered successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT token
        const payload = { user: { id: user._id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 10800 }); // 3 hours

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// // Update password endpoint

// app.put('/update-password', authenticate, async (req, res) => {
//     const { currentPassword, newPassword } = req.body;

//     try {
//         // Check if the user exists
//         const user = await usersCollection.findOne({ _id: ObjectId(req.user.id) });

//         if (!user) {
//             return res.status(400).json({ msg: 'User not found' });
//         }

//         // Compare current password
//         const isMatch = await bcrypt.compare(currentPassword, user.password);

//         if (!isMatch) {
//             return res.status(400).json({ msg: 'Current password is incorrect' });
//         }

//         // Hash the new password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(newPassword, salt);

//         // Update the password
//         const result = await usersCollection.updateOne({ _id: ObjectId(req.user.id) }, { $set: { password: hashedPassword } });

//         res.json({ result, msg: 'Password updated successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


// Endpoint to initiate the forgot password process
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user with the provided email exists
        const user = await usersCollection.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a random verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        // Store the verification code along with the user's email
        verificationCodes[email] = {
            code: verificationCode,
            timestamp: Date.now(),
        };

        // Send an email with the verification code
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Password Reset Verification Code',
            text: `Your verification code is: ${verificationCode}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to send verification code email' });
            }

            res.json({ msg: 'Verification code sent successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to verify the received code and update the password
app.post('/reset-password', async (req, res) => {
    const { email, code, newPassword } = req.body;

    try {
        // Check if the verification code is correct and not expired (e.g., within 5 minutes)
        const storedCode = verificationCodes[email];

        if (!storedCode || storedCode.code !== code || Date.now() - storedCode.timestamp > 5 * 60 * 1000) {
            return res.status(400).json({ error: 'Invalid or expired verification code' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password in the database
        const result = await usersCollection.updateOne({ email }, { $set: { password: hashedPassword } });

        // Remove the used verification code
        delete verificationCodes[email];

        res.json({ result, msg: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});