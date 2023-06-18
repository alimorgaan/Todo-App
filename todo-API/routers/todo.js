const router = require('express').Router();
const isAuth = require('../middlewares/isAuth');
const todoController = require('../controllers/todo');

router.get('/', isAuth, todoController.getAllTodos);
router.post('/', isAuth, todoController.addTodo);
router.delete('/:todoId', isAuth, todoController.deleteTodo);
router.put('/completed/:todoId', isAuth, todoController.completedTodo);

module.exports = router;
