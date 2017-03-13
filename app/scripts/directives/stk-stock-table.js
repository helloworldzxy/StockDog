'use strict';

/**
 * @ngdoc directive
 * @name stockDogApp.directive:stkStockTable
 * @description
 * # stkStockTable
 */
angular.module('stockDogApp')
  .directive('stkStockTable', function () {
    return {
      templateUrl: 'views/templates/stock-table.html',
      restrict: 'E',

      //[1]隔离作用域 绑定DOM元素的特性watchlsit，并赋给它一个用于执行的表达式
      scope:{
        watchlist: '='
      },
      //[2]创建一个控制器，用作该指令向外部公开用于通信的API
      controller: function($scope){
        var rows = [];

        $scope.$watch('showPercent', function(showPercent){
          if(showPercent){
            _.each(rows, function(row){ //该指令在内部追踪表内的所有行，在必要的时候修改showPercent属性
              row.showPercent = showPercent;
            });
          }
        });

        //这两个方法对外部可用
        this.addRow = function (row) {
          rows.push(row);
        };

        this.removeRow = function(row){
          _.remove(rows, row);
        };
      },
      //[3]标准的链接函数实现，用于DOM操作
      link: function ($scope) {
        $scope.showPercent = false;
        $scope.removeStock = function(stock){ //通过顶级指令作用域公开removeStock方法
          $scope.watchlist.removeStock(stock);
        };
      }
    };
  });
