var express = require('express');
var router = express.Router();
var auth = require('./auth');
var error = require('../utils/error');
var multer =  require('multer');
var config =  require('../config/config');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log( config.uploadPath );
        cb(null, config.uploadPath)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname  )
    }
});

var upload = multer({ storage: storage }).single('file');

/* GET home page. */
router.get('/', auth.Auth, function (req, res, next) {
    res.render('main');
});

router.post('/blog', auth.Auth, function (req, res) {
    var field       = req.body;
    var Blog        = global.mongoose.model('Blog');

    var category    = field.cat_id;
    var pnum        = field.pnum || 0;
    var condition = {};
    if ( category ) {
        condition = { category_idcategory : category };
    }
    Blog
        .find(condition)
        .skip(pnum)
        .limit(10)
        .sort({blog_reg_date: -1})
        .exec(function (err, blogs) {
            if (err) {
                error.SERVER_ERROR(res, err);
                return;
            }
            Blog.count(condition, function(err, count){
                res.send({
                    count       : count,
                    blogs       : blogs,
                    categories  : req.categories
                });
            });
        });
});



router.post('/blog/feed', auth.Auth, function (req, res) {
    var field       = req.body;
    var Blog        = global.mongoose.model('Blog');
    var Reply       = global.mongoose.model('Reply');
    var Category    = global.mongoose.model('Category');
    var category    = field.cat_id;
    var blog_id     = field.blog_id;
    var pnum        = field.pnum || 0;
    var condition = {};
    if ( category ) {
        condition = { category_idcategory : category };
    }
    if ( blog_id ) {
        condition._id = blog_id;
    }
    Blog
        .find(condition)
        .skip(pnum)
        .limit(1)
        .sort({blog_reg_date: -1})
        .exec(function (err, blog) {
            if (err) {
                error.SERVER_ERROR(res, err);
                return;
            }
            blog = blog[0];
            Reply.find({ parent_board_id : blog.board_id })
                .sort({ reply_reg_date:-1})
                .exec(function(err, replies){

                    if (err) {
                        error.SERVER_ERROR(res, err);
                        return;
                    }
                    // 블로그 아이디가 들어온 경우에는 카테고리 번호로 바꾸어서 같은 카테고리의 연관 게시물로 조회
                    if ( blog_id ) {
                        condition = { category_idcategory : blog.category_idcategory };
                    }
                    Blog.find(condition,'blog_subject')
                        .skip(pnum+1)
                        .limit(5)
                        .sort({blog_reg_date: -1})
                        .exec(function(err, previews){
                            Blog.count(condition, function(err, count){
                                res.send({
                                    count       : count,
                                    blog        : blog,
                                    replies     : replies,
                                    categories  : req.categories,
                                    previews    : previews
                                });

                            });
                        });
                });
        });
});


router.get('/post', auth.basicAuth, function(req, res){
    res.render('post', {
        categories  : req.categories
    });
});
router.post('/blog/post', auth.Auth, function(req, res){
    console.log( req.body );
    var Blog        = global.mongoose.model('Blog');

    var blog = new Blog(req.body);
    blog.save(function(err, result){
        console.log( arguments );
        res.send(result);
    });
});

router.post('/imageUpload', auth.Auth, function(req, res){
    upload(req, res, function(err){
        var fileName = req.file.filename;
        console.log( config.webPath + fileName );
        res.send(config.webPath + fileName);
    })



});


router.post('/reply/write', function (req, res) {
    var field = req.body;
    var board_id    = field.board_id;
    var content     = field.content;
    var writer      = field.writer;

    var Reply       = global.mongoose.model('Reply');
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    var reply = new Reply({
        parent_board_id     : board_id,
        reply_member_name   : writer,
        reply_reg_date      : Date.now(),
        reply_content       : content,
        reply_member_ip     : ip
    }).save(function(err, reply){
        res.send(reply);
    });

});




module.exports = router;
