/**
 * Created by hucloud on 2015. 12. 4..
 */
var path = require('path');
uploadPath = '/hucloud/blog_data/';
webPath = 'http://resource.hutt.co.kr/';

// 개발 환경의 파일 경로
if ( !process.env.NODE_ENV || process.env.NODE_ENV == 'development') {
    uploadPath  = path.join(__dirname + '/../public/uploads');
    webPath     = 'http://localhost:3000/uploads/'
}

module.exports = {
    mode : process.env.NODE_ENV,
    db   : {
        host : 'mongodb://localhost/hustory',
        user : '',
        pwd  : '',
    },
    sns : {
        facebook : { appId : '', secretKey : ''}
    },
    webPath    : webPath,
    uploadPath : uploadPath,
    postId : '',
    passwd : '',
    aws  : {}
};
