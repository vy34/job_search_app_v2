const router = require('express').Router();
const bookmarkController = require('../controllers/bookmarkController');
const { verifyToken, verifyAndAuth, verifyAgent } = require('../middleware/verifyToken');

router.post('/', verifyAndAuth, bookmarkController.createBookmark);
router.delete('/:id', verifyAndAuth, bookmarkController.deleteBookmark);
router.get('/', verifyAndAuth, bookmarkController.getAllBookmark);
router.get('/bookmark/:id', verifyAndAuth, bookmarkController.getBookmark);



module.exports = router;
