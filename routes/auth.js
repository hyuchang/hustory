/**
 * Created by hucloud on 2015. 12. 4..
 * 추 후 모든 요청 처리 전 걸릴 수 있도록 처리
 */


module.exports.Auth = function(req, res, next){
    next();
};
