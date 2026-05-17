const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid active credentials matched' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.syncEntraIdUser = async (req, res) => {
  const { entraId, name, email, department, upnManagerEmail } = req.body;
  try {
    let manager = null;
    if (upnManagerEmail) {
      manager = await User.findOne({ email: upnManagerEmail });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name, email, department, entraId,
        role: 'Employee',
        managerId: manager ? manager._id : null
      });
    } else {
      user.entraId = entraId;
      if (manager) user.managerId = manager._id;
      await user.save();
    }
    res.status(200).json({
      _id: user._id, name: user.name, role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};