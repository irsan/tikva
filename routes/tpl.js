const Express = require('express');
const router = Express.Router();

/* GET home page. */
router.get('/:tpl', function(req, res, next) {
    res.render('tpl/' + req.params.tpl);
});

module.exports = router;