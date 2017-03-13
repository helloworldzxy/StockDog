'use strict';

/**
 * @ngdoc function
 * @name stockDogApp.controller:WatchlistCtrl
 * @description
 * # WatchlistCtrl
 * Controller of the stockDogApp
 */
angular.module('stockDogApp')
  .controller('WatchlistCtrl', function ($scope, $routeParams, $modal, WatchlistService, CompanyService) {
    // Initializations
    $scope.companies = CompanyService.query(); //由company-service.js中的$resource服务提供的query()函数
    $scope.watchlist = WatchlistService.query($routeParams.listId);
    $scope.stocks = $scope.watchlist.stocks;
    $scope.newStock = {};
    var addStockModal = $modal({ //用$modal服务实例化一个addStockModal模态框
      scope: $scope,//$scope负责控制器中的变量和addstock-modal.html中的变量的传递
      template: 'views/templates/addstock-modal.html',
      show: false
    });

    $scope.showStockModal = function () {
      addStockModal.$promise.then(addStockModal.show); //?
    };

    $scope.addStock = function () {
      $scope.watchlist.addStock({
        listId: $routeParams.listId,
        company: $scope.newStock.company,
        shares: $scope.newStock.shares
      });
      addStockModal.hide();
      $scope.newStock = {};
    };
  });
