var express = require('express');
var router = express.Router();
var auth = require('./auth');
var error = require('../utils/error');

/* GET home page. */
router.get('/', auth.Auth, function (req, res, next) {
    res.render('index');

});

router.post('/blog/feed', auth.Auth, function (req, res) {
    var Blog        = global.mongoose.model('Blog');
    var Reply       = global.mongoose.model('Reply');
    var Category    = global.mongoose.model('Category');
    var category = req.body.cat_id;
    var condition = {};
    if ( category ) {
        condition = { category_idcategory : category };
    }
    Blog
        .findOne(condition)
        .sort({blog_reg_date: -1})
        .exec(function (err, blog) {
            if (err) {
                error.SERVER_ERROR(res, err);
                return;
            }

            Reply
                .find({ parent_board_id : blog.board_id })
                .sort({ reply_reg_date:-1})
                .exec(function(err, replies){

                if (err) {
                    error.SERVER_ERROR(res, err);
                    return;
                }
                Category.find({}, function(err,categories){
                    res.json({
                        blog: blog,
                        replies: replies,
                        categories : categories
                    });
                });
            });
        });
});


router.post('/reply/write', function (req, res) {
    res.json(req.body);
});

module.exports = router;
