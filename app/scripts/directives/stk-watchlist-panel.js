'use strict';

angular.module('stockDogApp')
  // Register directive and inject dependencies
  .directive('stkWatchlistPanel',
    function ($location, $modal, $routeParams, WatchlistService) { //指令的实现函数
    return {
      templateUrl: 'views/templates/watchlist-panel.html',
      restrict: 'E', //指令被限制为只能用作元素
      scope: {}, //隔离指令的作用域(使所有附加到$scope变量的值只在该指令上下文中可用)
      link: function ($scope) {
        // Initialize variables
        $scope.watchlist = {};
        $scope.currentList = $routeParams.listId; //?
        var addListModal = $modal({ //$modal是AngularStrap公开的服务
          scope: $scope,
          templateUrl: 'views/templates/addlist-modal.html', //将在Bootstrap模态框中渲染该template
          show: false
        });

        // Bind model from service to this scope
        //将服务的模型绑定到作用域
        $scope.watchlists = WatchlistService.query();

        // Display addlist modal
        $scope.showModal = function () { //这个showModal()函数在watchlist-panel.html中单击+号时被调用了
          addListModal.$promise.then(addListModal.show); //如何改变addListModal.show？show的初始值为false
        };

        // Create a new list from fields in modal
        $scope.createList = function () {
          WatchlistService.save($scope.watchlist);
          addListModal.hide();
          $scope.watchlist = {}; //$scope.watchlist保存了之后要置空
        };

        // Delete desired list and redirect to home
        $scope.deleteList = function (list) {
          WatchlistService.remove(list);
          $location.path('/');
        };

        // Send users to desired watchlist view
        $scope.gotoList = function (listId) {
          $location.path('watchlist/' + listId);
        };
      } //end of link function
    }; //end of return 
  });
