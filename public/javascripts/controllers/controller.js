/**
 * Created by hucloud on 2015. 11. 9..
 */
(function(){
    angular.module('blog', [])
        .controller('blog',function($scope,$http,$sce){
            init();
            $scope.title = '{{ 감이 있는 신휴창의 블로그 }}';
            $scope.author = '신휴창';
            $scope.postdate = '2015. 11. 20';
            $scope.nickname = 'Hutt';

            function init(category){
                var parameter = {};
                if ( category ){
                    parameter = {cat_id:category};
                }
                $http.post('/blog/feed', parameter).success(function(data){
                    console.log( parameter );
                    $scope.blog =  $sce.trustAsHtml(data.blog.board_content);
                    $scope.replies =  data.replies;
                    $scope.categories =  data.categories;
                }).error(errorCallBack);
            }
            /**
             * 리플작성
             */
            $scope.doWriteReply = function(){
                $http.post('/reply/write', $scope.reply)
                    .success(replyWritecallback)
                    .error(errorCallBack);
            };

            $scope.reloadBlog = function(category){
                init(category);
            };
        });


    var replyWritecallback = function(result){
        console.log( result );
    };

    var errorCallBack = function(err){
        console.log( err );
    }
})();



