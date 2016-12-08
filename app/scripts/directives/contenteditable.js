'use strict';

/**
 * @ngdoc directive
 * @name stockDogApp.directive:contenteditable
 * @description
 * # contenteditable
 */

var NUMBER_REGEXP = /^\S*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

angular.module('stockDogApp')
  .directive('contenteditable', function ($sce) {
    return {
      restrict: 'A',
      require: 'ngModel', //获得NgModelController
      link: function ($scope, $element, $attrs, ngModelCtrl) {
        if(!ngModelCtrl) {return;}

        //[2]指定如何更新UI
        ngModelCtrl.$render = function(){
          $element.html($sce.getTrustedHtml(ngModelCtrl.$viewValue || ''));
        };

        //[3]读取HTML值，然后将数据写入模型或者重置视图
        var read = function(){
          var value = $element.html();
          if($attrs.type === 'number' && !NUMBER_REGEXP.test(value)){
            ngModelCtrl.$render(); //如果不是数字 则使用之前的值更新视图
          }else{
            ngModelCtrl.$setViewValue(value);
          }
        };

        //[4]添加基于解析器的自定义输入类型（只支持'number'）
        //This will be applied to the $modelValue
        if($attrs.type === 'number'){
          ngModelCtrl.$parsers.push(function(value){
            return parseFloat(value);
          });
        }

        //[5]监听改变事件，启用绑定
        $element.on('blur keyup change', function(){
          $scope.$apply(read);
        });
      }
    };
  });
