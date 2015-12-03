/**
 * Created by hucloud on 2015. 11. 9..
 */
(function(){
    angular.module('blog', [])
        .controller('blog',['$scope', '$http', function($scope,$http){
            $scope.title = '{{ 휴클라우드 블로그 }}';
            $scope.author = '신휴창';
            $scope.postdate = '2015. 11. 20';
            $scope.nickname = 'Hutt';

            $scope.doWriteReply = function(){
                $http.post('/reply/write', $scope.reply).success(callback).error(function(error){
                    alert($scope.reply.content );
                });
            }


            var callback = function(callback) {
                console.log( arguments );
            }
        }]);
})();



