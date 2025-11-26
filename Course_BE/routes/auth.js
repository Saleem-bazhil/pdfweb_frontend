const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ✅ Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Email already in use' });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user" // default role
    });

    // ✅ sign token INCLUDING ROLE
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium,
      },
    });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    // ✅ sign token INCLUDING ROLE
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPremium: user.isPremium,
      },
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
