/**
 * Created by hucloud on 2015. 11. 9..
 */
var blog = {
    title           : '{{ 감이 있는 신휴창의 블로그 }}',
    subtitle        : '감성개발자 신휴창의 블로그',
    author          : '신휴창',
    nickname        : 'Hutt',
    description     : '개발자 신휴창',
};


(function(){
    angular.module('blog', []).controller('blog',function($scope,$http,$sce){
        $scope.title = blog.title;
        $scope.author = blog.author;
        $scope.nickname = blog.nickname;
        init();
        function loadData(parameter){
            $http.post('/blog/feed', parameter).success(function(data){
                $scope.blog         =  data.blog;
                $scope.selectedCategory = $scope.blog.category_idcategory;
                $scope.blogcount    =  data.count;
                $scope.replies      =  data.replies;
                $scope.categories   =  data.categories;
                $scope.previews     =  data.previews;
                $scope.blogContent  =  $sce.trustAsHtml(data.blog.board_content);
            }).error(errorCallBack);
        }
        /**
         * 블로그 컨텐츠 로딩
         * @param category
         */
        function init(category,pnum){
            var parameter = {};
            $scope.pageNum = 0;
            $scope.selectedCategory = undefined;
            if ( category ){
                $scope.selectedCategory = category;
                parameter.cat_id        = category;
            }
            if ( pnum ) {
                $scope.pageNum = pnum;
                parameter.pnum = pnum;
            }
            loadData(parameter);
        }
        /**
         * 리플작성
         */
        $scope.doWriteReply = function(){
            var data = {
                content     : $scope.reply.content,
                board_id    : $scope.blog.board_id,
                writer      : '신휴창'
            };
            $http.post('/reply/write', data)
                .success(function(){
                    $scope.reply.content = '';
                    init($scope.selectedCategory, $scope.pageNum);
                }).error(errorCallBack);
        };
        /**
         * 페이지 전환
         * @param category
         */
        $scope.reloadBlog = function(category, pnum){
            init(category,pnum);
        };

        $scope.loadBlog = function(blog_id){
            loadData({blog_id:blog_id});
        };

        $scope.newArray = function(count){
            var array = [];
            for (var i = 0; i < count; i++) {
                array.push(i)
            }
            return array;
        }
    });

    angular.module('blog-main', []).controller('main-controller',function($scope,$http,$sce){
        $scope.title = blog.title;
        $scope.author = blog.author;
        $scope.nickname = blog.nickname;
        $scope.subtitle = blog.subtitle;
        $scope.description = blog.description;

        init();
        function init(category, pnum){
            var param = {};
            if ( category ) {
                param = {cat_id:category};
            }
            $http.post('/blog', param).success(function(data){
                $scope.blogs            =  data.blogs;
                //$scope.selectedCategory =  $scope.blog.category_idcategory;
                $scope.blogcount        =  data.count;
                $scope.categories       =  data.categories;
            }).error(errorCallBack);
        };

        $scope.convertHtml = function(boardContent){
            return $sce.trustAsHtml(boardContent);
        };

        $scope.reloadBlog = function(param){
            init(param);
        };



    });

    var errorCallBack = function(err){
        console.log( err );
    }
})();



