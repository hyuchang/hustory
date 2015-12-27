/**
 * Created by hucloud on 2015. 12. 4..
 * 추 후 모든 요청 처리 전 전처리 될 수 있도록 처리
 */

var basicAuth =  require('basic-auth');

module.exports.Auth = function(req, res, next){

    var Category    = global.mongoose.model('Category');
    Category.find({}, function(err,categories){
        if ( !err ) {
            req.categories = categories;
        }
        next();
    });
};

exports.basicAuth = function(req, res, next) {
    var user = basicAuth(req);
    if (!user || user.name !== config.postId || user.pass !== config.passwd ) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
    }
    var Category    = global.mongoose.model('Category');
    Category.find({}, function(err,categories){
        if ( !err ) {
            req.categories = categories;
        }
        next();
    });
};
