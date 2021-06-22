const express = require('express');

const tagControlller = require('../controllers/tags');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', tagControlller.getTags);
router.get('/:id', tagControlller.getTag);
router.post('/add', auth.isAdmin, tagControlller.addTag);
router.put('/update', auth.isAdmin, tagControlller.updateTag);
router.delete('/delete/:id', auth.isAdmin, tagControlller.deleteTag);

module.exports = router;