const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const svgCaptcha = require('svg-captcha');


//Validate Email
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
// let captchaText; //For hold captcha in variable

// Create captcha
const captcha = async (req, res) => {
    try {
        const captcha = svgCaptcha.create({
            size: 6, // minimum length of 6 characters
            ignoreChars: '0o1iIl', // optional: remove characters that can be confused
            // noise: 3, // add noise to the image for more complexity
            // color: false, // colorful text
            // background: '#ffffff', // optional: set background color
            charPreset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
        });
        // captchaText = captcha.text; // Store the captcha text in a variable
        req.session.captcha = captcha.text;
        res.type('svg'); // Send back the image as SVG
        res.status(200).send(captcha.data); // Send the SVG image to the client
    } catch (err) {
        res.status(500).json({ message: "Error in registration", error: err.message });
    }
};

// Register Function
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!validateEmail(email)) {
            return res.status(400).json({ message: "Please enter correct email" });
        }
        // Check if user already exists
        const userExists = await User.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { username }
                ],
                // [Op.and]: [
                //     { email },
                //     { password }
                // ]
            }
        });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({ username, email, password: hashedPassword });

        res.status(200).json({ message: "User registered successfully", user: user });
    } catch (err) {
        res.status(500).json({ message: "Error in registration", error: err.message });
    }
};

//Login Function
const login = async (req, res) => {
    try {
        const { email, password, captcha } = req.body;
        
        if (captcha !== req.session.captcha) {
            return res.status(400).json({ success: false, message: 'CAPTCHA verification failed!' });
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        req.session.captcha = null;
        res.status(200).json({ token, user: user });
    } catch (err) {
        res.status(500).json({ message: "Error in login", error: err.message });
    }
};

//Get data
const getData = async (req, res) => {
    try {
        // Find user
        const user = await User.findAll({ attributes: ['username', 'email'] });
        res.status(200).json({ user: user });
    } catch (err) {
        res.status(500).json({ message: "Error in data fetchnig", error: err.message });
    }
};

module.exports = { register, login, getData, captcha }