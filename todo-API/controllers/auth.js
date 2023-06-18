const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.signup = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) throw new Error('Username and password are required');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');
        if (username.length < 3) throw new Error('Username must be at least 3 characters');

        const existingUser = await prisma.user.findUnique({
            where: {
                username,
            }
        });
        if (existingUser) throw new Error('Username already exists');

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            }
        });
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        res.status(200).json({
            token,
            username,
        });
    } catch (err) {
        next(err);
    }
}


exports.login = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                username,
            }
        });
        if (!user) {
            throw new Error('No user with that username');
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error('Incorrect password');
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        res.status(200).json({
            token,
            username,
        });
    } catch (err) {
        next(err);
    }
}