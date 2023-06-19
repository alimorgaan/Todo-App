
const express = require('express');
const { Prisma } = require('@prisma/client');

const authRouter = require('./routers/auth');
const todoRouter = require('./routers/todo');

const app = express();
const port = 3000;


//---------Middleware---------//
app.use(express.json());


//---------Routers---------//
app.use('/auth', authRouter);
app.use('/todo', todoRouter);


//----------error handling---------//
app.use((err, req, res, next) => {
    console.log(err);
    const status = err.status || 500;
    var message = '';

    if (err instanceof Prisma.PrismaClientKnownRequestError ||
        err instanceof Prisma.PrismaClientUnknownRequestError ||
        err.message === null) {
        message = 'Something Wrong!';
    }
    else
        message = err.message;

    res.status(status).json({ msg: message });
});


app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})

