'use strict';

/**
 * @ngdoc function
 * @name stockDogApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the stockDogApp
 */
angular.module('stockDogApp')
  .controller('MainCtrl', function ($scope, $location, WatchlistService) {
    //$scope._ = _;

    //[1]为动态导航链接填充监视列表
    $scope.watchlists = WatchlistService.query(); //用于为导航项动态创建多个下拉列表

    //[2]将$location.path()函数用做$watch表达式
    $scope.$watch(function(){ 
    //$scope.$watch()会监视第一个参数函数的返回值变化，每次前一个函数的返回值改变时，都会执行后面的函数，从而实现了路由解析
      return $location.path();
    }, function (path){
      if(_.includes(path, 'watchlist')){ //_.contains是旧版本的lodash用的，改用indexOf或者includes就不报错了
      //if(_.indexOf(path, 'watchlist') >= 0){
        $scope.activeView = 'watchlist';
      }else{
        $scope.activeView = 'dashboard';
      }
    });
  });
