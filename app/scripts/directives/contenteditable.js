'use strict';

/**
 * @ngdoc directive
 * @name stockDogApp.directive:contenteditable
 * @description
 * # contenteditable
 */

var NUMBER_REGEXP = /^\S*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;
//* 匹配前面的元字符0、多次
//?              0、1次
//+              1、多次
// \s 匹配一个空白字符
// \S       非空白字符
// \d       数字字符

angular.module('stockDogApp')
  .directive('contenteditable', function ($sce) { //注入依赖Strict Contextual Escaping服务
    return {
      restrict: 'A',
      require: 'ngModel', //获得NgModelController，希望使用双向绑定，根据用户的修改触发对表格剩余部分的更新
      link: function ($scope, $element, $attrs, ngModelCtrl) {
        if(!ngModelCtrl) {return;}

        //[2]指定如何更新UI
        ngModelCtrl.$render = function(){
          //在更新视图的HTML之前清理数据
          $element.html($sce.getTrustedHtml(ngModelCtrl.$viewValue || ''));
        };

        //[3]读取HTML值，然后将数据写入模型或者重置视图
        var read = function(){
          var value = $element.html();
          if($attrs.type === 'number' && !NUMBER_REGEXP.test(value)){
            ngModelCtrl.$render(); //如果不是数字 则使用之前的值更新视图
          }else{
            ngModelCtrl.$setViewValue(value);//使用新值调用$render()，并启动ngModel $parsers管道。
          }
        };

        //[4]添加基于解析器的自定义输入类型（只支持'number'）
        //This will be applied to the $modelValue
        if($attrs.type === 'number'){
          ngModelCtrl.$parsers.push(function(value){ //自定义一个解析器，用于支持数字输入类型
            return parseFloat(value); 
          });
        }

        //[5]监听改变事件，启用绑定
        $element.on('blur keyup change', function(){
          $scope.$apply(read); //在每次修改之后调用read()函数
        });
      }
    };
  });
