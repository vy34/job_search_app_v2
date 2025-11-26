const router = require('express').Router();
const JobController = require('../controllers/JobController');

router.post('/', JobController.createJob);
router.get('/', JobController.getAllJob);
router.get('/:id', JobController.getJob);
router.put('/:id', JobController.updateJob);
router.delete('/:id', JobController.deleteJob);
router.get('/search/:key', JobController.searchJob);



module.exports = router;
