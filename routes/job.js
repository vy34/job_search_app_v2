const router = require('express').Router();
const jobController = require('../controllers/jobController');
const { verifyToken } = require('../middleware/verifyToken');

router.post('/', verifyToken, jobController.createJob);
router.get('/', jobController.getAllJob);
router.get('/agent/:uid', jobController.getAgentJobs);
router.get('/search/:key', jobController.searchJob);
router.get('/:id', jobController.getJob);
router.put('/:id', verifyToken, jobController.updateJob);
router.patch('/:id/image', verifyToken, jobController.updateJobImage);
router.delete('/:id', verifyToken, jobController.deleteJob);

module.exports = router;
