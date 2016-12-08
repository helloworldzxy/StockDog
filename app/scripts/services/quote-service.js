'use strict';

/**
 * @ngdoc service
 * @name stockDogApp.QuoteService
 * @description
 * # QuoteService
 * Service in the stockDogApp.
 */
angular.module('stockDogApp')
  .service('QuoteService', function ($http, $interval) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var stocks = [];
    var BASE = 'http://query.yahooapis.com/v1/public/yql';

    //[1]使用来自报价的适当数据更新股票
    var update = function(quotes){
      console.log(quotes);
      if(quotes.length === stocks.length){
        _.each(quotes, function(quote, idx){
          var stock = stocks[idx];
          stock.lastPrice = parseFloat(quote.LastTradePriceOnly + _.random(-0.5, 0.5));
          //stock.lastPrice = _.random(-0.5, 0.5);
          stock.change = quote.Change;
          stock.percentChange = quote.ChangeinPercent;
          stock.marketValue = stock.shares * stock.lastPrice;
          stock.dayChange = stock.shares * parseFloat(stock.change);
         /* stock.change =  _.random(-0.5, 0.5);
          stock.percentChange =  _.random(-0.5, 0.5);
          stock.marketValue =  _.random(-0.5, 0.5);
          stock.dayChange =  _.random(-0.5, 0.5);*/
          stock.save();
        });
      }
    };

    //[2]管理获取哪只股票报价的辅助函数
    this.register = function(stock){
      stocks.push(stock);
    };
    this.deregister = function(stock){
      _.remove(stocks, stock);
    };
    this.clear = function(){
      stocks = [];
    };

    //[3]与Yahoo Finance API 通信的主处理函数
    this.fetch = function(){
      var symbols = _.reduce(stocks, function(symbols, stock){
        symbols.push(stock.company.symbol);
        return symbols;
      }, []);
      var query = encodeURIComponent('select * from yahoo.finance.quotes ' + //where前面的空格
        'where symbol in (\'' + symbols.join(',') + '\')');
      var url = BASE + '?' + 'q=' + query + '&format=json&diagnostics=true' +
          '&env=http://datatables.org/alltables.env';
      $http.jsonp(url + '&callback=JSON_CALLBACK')
        .success(function(data){
          if(data.query.count){
            var quotes = data.query.count > 1 ?
              data.query.results.quote : [data.query.results.quote];
            update(quotes);
          }
        })
        .error(function(data){
          console.log(data);
        });

    };
    //[4]用于每5秒抓取一次新的报价数据
    $interval(this.fetch, 2000);
  });
