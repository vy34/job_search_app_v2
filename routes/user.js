const router = require('express').Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyAndAuth, verifyAgent } = require('../middleware/verifyToken');

// Skills routes must be defined before /:id
router.post('/skills', verifyAndAuth, userController.addSkills);
router.get('/skills', verifyAndAuth, userController.getSkills);
router.delete('/skills/:skillId', verifyAndAuth, userController.deleteSkills);

// Agent routes - define /agents before /:id 
router.get('/agents', userController.getAgents);
router.post('/agents', verifyAndAuth, userController.addAgent);
router.get('/agents/:id', verifyAndAuth, userController.getAgent);
router.put('/agents/:id', verifyAndAuth, userController.updateAgent);

// User routes
router.get('/', verifyAndAuth, userController.getUser);
router.put('/', verifyAndAuth, userController.updateUser);
router.put('/:id', verifyAndAuth, userController.updateUser);
router.delete('/:id', verifyAndAuth, userController.deleteUser);

module.exports = router;
