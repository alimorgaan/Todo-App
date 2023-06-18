const jwt = require('jsonwebtoken');


function isAuth(req, res, next) {
    const token = req.headers.authorization;
    try {
        if (!token) throw new Error('You need to Login');
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) throw new Error('Invalid Token');
        req.userId = parseInt(decodedToken.userId);
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = isAuth;