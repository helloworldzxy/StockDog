'use strict';

angular.module('stockDogApp')
//.service()将该服务注册在顶级模块stockDogApp上，使其他位置也可以引用该服务。
  .service('WatchlistService', function WatchlistService() { 
    // Augment Stocks with additional helper functions
    var StockModel = {
      save: function () {
        var watchlist = findById(this.listId);
        watchlist.recalculate();
        saveModel();
      }
    };

    // Augment Watchlists with additional helper functions
    var WatchlistModel = {
      addStock: function (stock) {
        var existingStock = _.find(this.stocks, function (s) {
          return s.company.symbol === stock.company.symbol;
        });
        if (existingStock) {
          existingStock.shares += stock.shares;
        } else {
          _.extend(stock, StockModel);
          this.stocks.push(stock);
        }
        this.recalculate();
        saveModel();
      },
      removeStock: function (stock) {
        _.remove(this.stocks, function (s) {
          return s.company.symbol === stock.company.symbol;
        });
        this.recalculate();
        saveModel();
      },
      recalculate: function () {
        var calcs = _.reduce(this.stocks, function (calcs, stock) {
          calcs.shares += stock.shares;
          calcs.marketValue += stock.marketValue;
          calcs.dayChange += stock.dayChange;
          return calcs;
        }, { shares: 0, marketValue: 0, dayChange: 0 });

        this.shares = calcs.shares;
        this.marketValue = calcs.marketValue;
        this.dayChange = calcs.dayChange;
      }
    };

    // Helper: Load watchlists from localStorage
    var loadModel = function () { 
      var model = { //从localStorage中获取存储的监视列表watchlists和对应的Id
        //localStorage中存储的数据使用以StockDog为命名空间的键，避免潜在冲突
        watchlists: localStorage['StockDog.watchlists'] ?
          JSON.parse(localStorage['StockDog.watchlists']) : [],
        nextId: localStorage['StockDog.nextId'] ?
          parseInt(localStorage['StockDog.nextId']) : 0
      };
      _.each(model.watchlists, function (watchlist) { //lodash函数式编程工具库 _.each -> _.forEach
        _.extend(watchlist, WatchlistModel); //_.extend -> _.assign,遍历并继承来源对象的属性
        _.each(watchlist.stocks, function (stock) {
          _.extend(stock, StockModel);
        });
      });
      return model; //最后会用loadModel()定义Model变量，用于其他辅助函数和内部函数用
    };

    // Helper: Save watchlists to localStorage
    //先将watchlist数组内容字符化（localStorage只能存储字符串），然后持久化存储到localStorage中。
    var saveModel = function () {
      localStorage['StockDog.watchlists'] = JSON.stringify(Model.watchlists);
      localStorage['StockDog.nextId'] = Model.nextId;
    };

    // Helper: Use lodash to find a watchlist with given ID
    var findById = function (listId) {
      return _.find(Model.watchlists, function (watchlist) { 
        return watchlist.id === parseInt(listId);
      });
    };

    // Return all watchlists or find by given ID
    this.query = function (listId) { //通过this直接将函数附加到服务实例中
      if (listId) {
        return findById(listId);
      } else {
        return Model.watchlists;
      }
    };

    // Save a new watchlist to watchlists model
    this.save = function (watchlist) { //参数为接收一个新创建的要保存的watchlist
      watchlist.id = Model.nextId++;
      watchlist.stocks = [];
      _.extend(watchlist, WatchlistModel); //WatchlistModel？？中也要添加新创建的watchlist
      Model.watchlists.push(watchlist);
      saveModel();
    };

    // Remove given watchlist from watchlists model
    this.remove = function (watchlist) { //传入要删除的watchlist
      _.remove(Model.watchlists, function (list) { //遍历Model.watchlists数组元素：list
        return list.id === watchlist.id; //遍历时当前元素list与传入参数watchlist比较
      });
      saveModel();
    };

    // Initialize Model for this singleton service
    var Model = loadModel();
  });
