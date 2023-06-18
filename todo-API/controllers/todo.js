const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.getAllTodos = async (req, res, next) => {
    const userId = req.userId;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                todos: true
            }
        });
        if (!user) throw new Error('User not found');
        res.status(200).json(user.todos);
    }
    catch (err) {
        next(err);
    }
}


exports.addTodo = async (req, res, next) => {
    const userId = req.userId;
    const { title } = req.body;
    try {
        if (!title) throw new Error('Title is required');
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) throw new Error('User not found');
        const todo = await prisma.todo.create({
            data: {
                title,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        });
        res.status(200).send();
    }
    catch (err) {
        next(err);
    }
}

exports.deleteTodo = async (req, res, next) => {
    const userId = req.userId;
    const { todoId } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userId)
            }
        });
        if (!user) throw new Error('User not found');
        const todo = await prisma.todo.findUnique({
            where: {
                id: parseInt(todoId)
            }
        });
        if (!todo) throw new Error('Todo not found');
        if (todo.userId !== user.id) throw new Error('You are not authorized to delete this todo');
        await prisma.todo.delete({
            where: {
                id: parseInt(todoId)
            }
        });
        res.status(200).send();
    }
    catch (err) {
        next(err);
    }

}

exports.completedTodo = async (req, res, next) => {
    const userId = req.userId;
    const { todoId } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userId)
            }
        });
        if (!user) throw new Error('User not found');
        const todo = await prisma.todo.findUnique({
            where: {
                id: parseInt(todoId)
            }
        });
        if (!todo) throw new Error('Todo not found');
        if (todo.userId !== user.id) throw new Error('You are not authorized to modifiy this todo');
        await prisma.todo.update({
            where: {
                id: parseInt(todoId)
            },
            data: {
                completed: true
            }
        });
        res.status(200).send();
    }
    catch (err) {
        next(err);
    }
}