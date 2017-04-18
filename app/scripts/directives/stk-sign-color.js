'use strict';

/**
 * @ngdoc directive
 * @name stockDogApp.directive:stkSignColor
 * @description
 * # stkSignColor
 */
angular.module('stockDogApp')
  .directive('stkSignColor', function () {
    return {
      restrict: 'A',
      link: function ($scope, $element, $attrs) {
        //[1]使用$observe监视表达式的变化
        $attrs.$observe('stkSignColor', function(newVal){ //$attrs.$observe()只用于监视DOM属性值的变化
          var newSign = parseFloat(newVal);
          //[2]根据符号设置元素的style.color值
          if(newSign > 0){
            $element[0].style.color = 'Green';
          }else{
            $element[0].style.color = 'Red';
          }
        });
      }
    };
  });
