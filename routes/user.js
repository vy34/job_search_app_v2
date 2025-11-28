const router = require('express').Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyAndAuth, verifyAgent } = require('../middleware/verifyToken');

router.get('/', verifyAndAuth, userController.getUser);
router.delete('/:id', verifyAndAuth, userController.deleteUser);
router.put('/', verifyAndAuth, userController.updateUser);



module.exports = router;
