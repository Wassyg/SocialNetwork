const express = require('express');
const router = express.Router();

//@route GET api/posts/test
//@desc test the route
//@access public
router.get('/test', (req, res)=>res.json({msg: "file posts works"})
);

module.exports = router;
