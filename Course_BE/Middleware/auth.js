const jwt = require('jsonwebtoken');
const User = require('../models/User');


module.exports = async function(req, res, next) {
try {
const authHeader = req.headers.authorization || req.cookies.token;
if (!authHeader) return res.status(401).json({ message: 'No token provided' });


const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log("Decoded:", decoded);
const user = await User.findById(decoded.id).select('-password');
if (!user) return res.status(401).json({ message: 'Invalid token' });

req.user = user;
next();
} catch (err) {
console.error(err);
return res.status(401).json({ message: 'Authentication failed' });
}
};