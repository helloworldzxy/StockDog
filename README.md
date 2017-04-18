# stock-dog

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## 1. yoman包括：

yo:脚手架工具，创建项目骨架。
grunt: 构建工具，运行各种任务（文件压缩，合并，打包等）。
bower:前端资源依赖管理，跟Npm区别：npm管理的是node模块的依赖，bower管理css, javascript文件等依赖。

为什么不用grunt-init而要用yeoman？

1）基于bower的前端资源依赖管理：管理依赖文件更方便。

2）子模板：用于子项目创建、子模块创建、资源更新等工作，给项目提供了更多的灵活性。

3）基于问题的项目骨架构建：这点其实grunt-init也有，但yeoman明显做得更好，如二选一、单选列表、多选列表等。grunt-init 的问答流程内部实现则相对费解。

一般yoman需要安装相应的generator来生成项目目录。如generator-angular。

`yo angular StockDog`

程序主体目录app/下有：
styles/ views/ scripts/

yeoman在配置Gruntfile.js时添加了任务用于监视应用文件的改动并自动刷新浏览器。

## 2. 创建watchlist股票监视列表

- 模块：显式指定如何启动组件。模块可按任意顺序异步加载，增强代码可重用性和可读性。

顶级app模块：app/scripts/app.js中：.module()定义主应用模块，接收主应用模块名字和依赖数组。类似RequireJS.

安装模块依赖：包括yeoman构建项目时安装的和AngularStrap（自己另外用bower安装，然后注册到app.js中的`.module()`函数的依赖数组中`mgcrea-ngStrap`）。

`ng-app`指令标记HTML元素为应用的根。

### 创建服务：`yo angular:service Watchlist-Service`
scripts/sevices/watchlist-service.js：负责读取、写入HTML5  LocalStorage中的监视列表模型。

- 服务：使用依赖注入连接在一起的可替换对象。服务是延迟实例化的单实例服务，只有当组件依赖于它们时才会被实例化。每个依赖它们的组件将收到一个由服务工厂生成的单实例引用。

通过命令行输入**子生成器命令**后创建服务、指令等，项目目录会自动生成相应的js文件并引入到index.html中。

bower安装lodash，函数式编程工具库。

使用HTML5 localStorage: `localStorage[键] = 值`。

### 创建指令：`yo angular:directive stk-Watchlist-Panel`

scripts/directives/stk-watchlist-panel.js

views/templates/watchlist-panel.html

views/templates/addlist-modal.html

- 指令：DOM元素上的标记，告诉angularjs的HTML编译器(`$compile`)把指定的行为附加到DOM元素及其子元素，甚至是转换DOM元素及其子元素。angularjs内置指令以ng-开头，本项目自定义指令以stk-开头。

- 在stk-watchlist-panel.js中，用.directive()将指令名注册在顶级模块中并注入相应的依赖服务。return的对象中包括：

该指令对应要渲染的模板的url(即watchlist-panel.html的相对路径)；

restrict:

scope:

link: function，该函数包括：

    $scope.watchlist的定义和赋值(赋值时用到了WatchlistServie.query()，
    用到的服务要在指令定义时就注入依赖)。

    用$modal服务定义addListModal，包含
    作用域的指定，在Bootstrap模态框中需要渲染的html模板的url地址，以及show的初始值。
    
    $scope上附加的处理器函数。
    
在自定义指令.js文件中定义的$scope.变量/函数，都能在相应的.html中访问

- 在watchlist-panel.html中，注意bootstrap提供的类实现图标、右浮动的使用；ng-if, ng-repeat, ng-click, ng-class的使用。

- 在addlist-modal.html中，引用了指令作用域的处理器函数，使用了有$modal服务公开的$hide()方法。input标记使用了ng-model增强指令，双向数据绑定，将输入的内容传递给指令的link()函数中初始化的$acope.watchlist.name和$scope.watchlist.description

### 使用指令
指令使用驼峰命名进行注册，但使用spinal-case命名方式进行引用。
`<stk-watchlist-panel></stk-watchlist-panel>`

## 3. 配置客户端路由

### 添加新的路由：`yo angular:route dashboart` `yo angular:route watchlist --uri=watchlist/:listId`

用Yeoman子生成器自动化生成路由：

定义新的控制器，DashboardCtrl, WatchlistCtrl

创建HTML模板，dashboard.html, watchlist.html

调用$routeProvider(path, route)方法，在index.html中引入相应的控制器script

$routeProvider定义路由，并实现深度链接，允许使用浏览器的历史导航。

### 使用路由

将$routeParams服务注入指令。

$scope.gotoList函数定义(在指令.js中)及调用(在html中)

$currentList的定义(在指令.js中)及使用(在html中)

### 模板视图

ngView指令（要求安装ngRoute模块），负责在布局模板(index.html)的`<ng-view>`元素插入由$route服务定义的视图模板。

views/dashboart.html

views/watchlist.html

使用bootstrap网格系统(col-md-3 col-md-9)创建两列，将`<stk-watchlist-panel>`包含在每个视图的左列。

## 4. 创建导航栏，加载MainCtrl

### 导航栏
将应用范围内的逻辑封装到单个控制器：在index.html中，angularjs应用的根元素加载ng-controller="MainCtrl"。因为该控制器中包含了无论目前执行什么路由都应该应用的逻辑。

用到Bootstrap中的nav navbar dropdown-toggle dropdown-menu等class及data-toggle等属性

ng-cloak: 应用加载时防止页面闪烁。

### 创建MainCtrl

`yo angular:controller Main`

scripts/controller/main.js：填充动态导航链接的下拉列表；用$scope.$watch()函数和$location服务实现路由解析。

## 5. 添加股票：单击目标监视列表的添加按钮后弹出新的模态框，可以搜索上市公司，指定股票数量，添加到目标监视列表中。

### 创建CompanyService

companies.json中有从三个股票交易所获得的相关公司股票的数据(假设与某种后端服务通信获得).

`yo angular:service Company-Service`

scripts/services/company.js

依赖注入$resource服务，获取本地json文件；

Gruntfile.js中，copy任务的src数组修改：添加json，从而使companies.json可以在为生产环境准备应用时被复制到构建的发行包中。

### 创建AddStock模态框

对每一个div.form-control部分，label标签的for属性等于其对应的input的id。

对于第一个input：bs-typeahead指令，将使用bs-options指令提供运行typeahead机制所需数据。`bs-options="company as company.label for company in companies"`,强迫它使用companies作用域变量中每个每个公司对象company的label属性(在WatchlistCtrl中会创建)，提供的数据将被显示在typeahead建议中。

两个input都加入了ng-model属性，双向绑定。

### 更新WatchlistService

抽象出监视列表和它们的相关股票之间的各种计算和交互，创建两个不同的对象用作所需行为的模型。

新建StockModel对象

新建WatchlistModel对象：含有三个函数：addStock,removeStock, recalculate，分别使用_.find _.remove _.reduce函数。前两个都是根据第二个参数函数进行查找，第三个是按照第二个参数函数进行迭代求和。

### 实现WatchlistCtrl

scripts/controllers/watchlist.js

实现模态框的实例化，showStockModal函数及addStock函数的实现

watchlist.js中的addStock() 与 watchlist-service.js中的addStock(),前者其实调用了后者。

### 修改监视列表视图

.jumbotron 超大屏幕

table-responsive 让表格水平滚动以适应小型设备（小于 768px）

ng-hide ng-show ng-repeat指令

## 6. 集成Yahoo Finance

使用Yahoo Finance从外部服务提供者获取报价信息

### 创建QuoteService

负责向Yahoo Finance API发起异步HTTP请求，并更新内存中的数据结构

`yo angular:service Quote-Service`

scripts/services/quote-service.js

注入依赖$http(用于向Yahoo Service API发起请求)和$interval(用于设置定时器，定时获取数据)

实现函数 update register deregister clear fetch.

```javascript
//fetch函数用于生成查询URL以及发出请求
$http.jsonp(requestURL)
.success(function(data){
    var quotes = data.query.count; 
    update(quotes);
})
.error(data){
    //...
}

```
### 从控制台调用服务

创建的服务未注入前的检测：在chrome F12输入:
```javascript
Quote = angular.element(document.body).injector().get('QuoteService')
Watchlist = angular.element(document.body).injector().get('WatchlistService')
Quote.register(Watchlist.query()[0].stocks[0])
```
验证是否能抓取到数据Object

## 7. 创建股票表格

不同指令之间交互数据

### 创建StkStockTable指令

`yo angular:directive stk-Stock-Table`

scripts/directives/stk-stock-table.js，在指令的return中：

在scope属性中包含一个对象，隔离指令作用域，并赋值执行表达式进行数据绑定；

controller属性：向其他指令公开API用于通信（可在其中对this附加一些函数，这些函数就可以被外部访问）；

link属性：通常用于DOM操作

### 创建StkStockRow指令

创建表格行重复使用的命令

`yo angular:directive stk-Stock-Row`

scripts/directives/stk-stock-row.js

return 中用到了require指明需要的特定控制器，scope包含对象，link函数(为股票行初始化提示信息，将该行添加到stockTableCtrl中并用QuoteService注册该股票,$on在删除行时注销它，如果是最后一行则fetch()抓取报价，$watch监视份额的变化并重新计算保存字段)。

### 创建股票表格模板

views/templates/stock-table.html

包含了stk-stock-row指令作为tr元素的属性，来生成表格的每一行。

用了ng-show ng-hide指令控制span元素的显示与隐藏切换。

td元素的文本内容通过双括号获取。

### 更新监视列表视图

views/watchlist.html

添加`<stk-stock-table>`元素

## 8. 内联表单编辑

### 创建contenteditable指令

`yo angular:directive contenteditable`

scripts/directives/contenteditable.js

### 更新StkStockTable模板

## 9.格式化货币

### 创建stkSignColor指令

`yo angular:directive stk-Sign-Color`

scripts/directives/stk-sign-color.js

$attrs.$observe 监视stkSignColor属性值变化，如果变化了根据新值正负改变其color

### 更新StockTable模板

过滤器：可以用在视图模板、控制器和服务中。在视图模板的表达式中应用过滤器：`{{expression | filter}}`

`<td stk-sign-color="{{watchlist.dayChange}}">{{watchlist.dayChange | currency}}</td>`

## 10. 为价格变动添加动画

单元格内文字颜色变化时显示淡入淡出效果

### 创建stkSignFade指令

`yo angular:directive stk-Sign-Fade`

scripts/directives/stk-sign-fade.js: $animate.addClass(元素，类名，回调函数)

styles/main.css: change-up/down-add, change-up-add/down-active:先立刻变为-add，再在-add设置的动画时长内变为-add-active

### 更新StockTable模板

## 11. 创建仪表盘

## 更新仪表盘控制器

`bower install angular-google-chart -save`然后注册到app.js的module()中。

scripts/controllers/dashboard.js

## 更新仪表盘视图

views/dashboard.html

`<div google-chart chart="donutChart" style="{{cssStyle}}"></div>`

styles/main.css中添加.well 仪表盘视图样式

## 12. 部署生产环境

`grunt build`: 生成dist/目录

上传代码到github

.gitignore中移除包含dist的行

`git subtree push --prefix dist origin gh-pages`
