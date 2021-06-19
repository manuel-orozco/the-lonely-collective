const express = require('express');

const router = express.Router();


// @GET api/posts
// @access public
router.get('/', (req, res) => {
    res.send('Posts route');
});

module.exports = router;