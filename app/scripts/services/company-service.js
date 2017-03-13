'use strict';

/**
 * @ngdoc service
 * @name stockDogApp.CompanyService
 * @description
 * # CompanyService
 * Service in the stockDogApp.
 */
angular.module('stockDogApp')
  .service('CompanyService', function CompanyService ($resource) {
  	//作为依赖注入的$resource服务将创建一个与REST风格的服务器端数据源进行交互的资源对象，
  	//该服务负责从本地文件系统中获取companies.json文件，并返回一个对象，通过该对象可查询公开交易的公司列表
    // AngularJS will instantiate a singleton by calling "new" on this function
    return $resource('companies.json');
  });
