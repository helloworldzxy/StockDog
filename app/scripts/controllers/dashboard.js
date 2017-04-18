'use strict';

/**
 * @ngdoc function
 * @name stockDogApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the stockDogApp
 */
angular.module('stockDogApp')
  .controller('DashboardCtrl', function ($scope, WatchlistService, QuoteService) {
    //[1]初始化
    var unregisterHandlers = [];
    $scope.watchlists = WatchlistService.query();
    $scope.cssStyle = 'height:300px'; //定义图表样式
    var formatters = { //定义图表格式选项
      number: [
        {
          columnNum: 1,
          prefix: '$'
        }
      ]
    };

    //[2]辅助函数：更新图表对象
    var updateCharts = function() {
      //双层圆环图
      var donutChart = {
        type: 'PieChart',
        displayed: true,
        data: [['Watchlist', 'Market Value']],
        options: {
          title: 'Market Value by Watchlist',
          legend: 'none',
          pieHole: 0.4
        },
        formatters: formatters
      };
      //柱状图
      var columnChart = {
        type: 'ColumnChart',
        displayed: true,
        data: [['Watchlist', 'Change', {role: 'style'}]],
        options: {
          title: 'Day Change by Watchlist',
          legend: 'none',
          animation: {
            duration: 1500,
            easing: 'linear'
          }
        },
        formatters: formatters
      };

      //[3]将数据推入图表对象
      _.each($scope.watchlists, function(watchlist){
        donutChart.data.push([watchlist.name, watchlist.marketValue]);
        columnChart.data.push([watchlist.name, watchlist.dayChange, watchlist.dayChange < 0 ? 'Red' : 'Green']);
      });
      $scope.donutChart = donutChart;
      $scope.columnChart = columnChart;
    };

    //[4]用于重置控制器状态的辅助函数
    var reset = function(){
      //[5]清除QuoteService之后重新注册新的股票
      QuoteService.clear();
      _.each($scope.watchlists, function(watchlist){
        _.each(watchlist.stocks, function(stock){
          QuoteService.register(stock);
        });
      });

      //[6]注销现有$watch监听器之后创建新的$watch监听器
      _.each(unregisterHandlers, function(unregister){
        unregister();
      });
      _.each($scope.watchlists, function(watchlist){
        var unregister = $scope.$watch(function(){ //创建新的$watch监听器
          return watchlist.marketValue;
        }, function(){
          recalculate();
        });
        unregisterHandlers.push(unregister);
      });
    };

    //[7]计算新的total MarketValue 和 DayChange
    var recalculate = function(){
      $scope.marketValue = 0;
      $scope.dayChange = 0;
      _.each($scope.watchlists, function(watchlist){
        $scope.marketValue += watchlist.marketValue ? watchlist.marketValue : 0;
        $scope.dayChange += watchlist.dayChange ? watchlist.dayChange : 0;
      });
      updateCharts();
    };

    //[8]监视监视列表的变化
    $scope.$watch('watchlists.length', function(){
      reset();
    });
  });
