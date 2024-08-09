const { sign, verify } = require('jsonwebtoken');

const generateAccessToken = (id, name, isPremiumUser) => {
    const token = sign({ userId: id, name: name, isPremiumUser }, process.env.SECRET_KEY);
    return token;
}

const verifyAccessToken = (token) => {
    return verify(token, process.env.SECRET_KEY);
}

module.exports = { generateAccessToken, verifyAccessToken };