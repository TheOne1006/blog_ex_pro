"use strict";var ngApp;ngApp=angular.module("theOneBlog",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ui.router","ui.bootstrap","ngSanitize","ngTouch","mgcrea.ngStrap","angular-carousel"]).factory("browserHelp",["$window",function(a){var b=a.innerWidth,c=768;var d=180;return{isMobile:b<c,defultContentWidth:d}}]);"use strict";angular.module("theOneBlog").directive("headroom",["$window","browserHelp",function(a,b){var c=a.Headroom;if(b.isMobile){return{restrict:"EA",scope:{tolerance:"=",offset:"=",classes:"=",scroller:"="},link:function(a,b){var d={};angular.forEach(c.options,function(b,e){d[e]=a[e]||c.options[e]});if(d.scroller){d.scroller=angular.element(d.scroller)[0]}var e=new c(b[0],d);e.init();a.$on("destroy",function(){e.destroy()})}}}return{}}]).directive("onFinishRender",function(a){return{restrict:"A",link:function(b){if(b.$last===true){a(function(){b.$emit("ngRepeatFinished")})}}}});"use strict";angular.module("theOneBlog").filter("keywordEm",["browserHelp",function(a){var b="<em>",c="</em>",d=a.defultContentWidth,e;function f(a,d){if(a.toLowerCase()===d.toLowerCase()){return b+a+c}return a}function g(a,d,f){var g=-1;e=new RegExp(d,"i");g=a.search(e);if(f){a=h(a,g,f)}if(g!==-1){return a.replace(e,b+"$&"+c)}return a}function h(a,b,c){var d=a.length,e;if(d<=c){return a}e=Math.floor(c/2);if(b-e<=0){return a.slice(0,c)+"..."}else if(b+e>=d){return"..."+a.slice(-c)}else{return"..."+a.slice(b-e,b+e)+"..."}}return function(a,b,c,e){if(c===undefined){return a}if(!e||isNaN(e)){e=d}switch(b){case"tag":a=f(a,c);break;case"title":a=g(a,c);break;case"content":a=g(a,c,e);break;default:break}return a}}]).filter("keywordPointFilter",["$filter",function(a){return function(b,c){if(!angular.isArray(b)){return b}if(b.length===0){return[]}angular.forEach(b,function(d,e){b[e].title=a("keywordEm")(d.title,"title",c);b[e].contentText=a("keywordEm")(d.contentText,"content",c);angular.forEach(d.keyWords,function(d,f){b[e].keyWords[f]=a("keywordEm")(d,"tag",c)})});return b}}]).filter("IndexArticlesWordlimit",["browserHelp",function(a){var b=a.defultContentWidth;function c(a,b){if(a.length>b){return a.slice(0,b)+"..."}return a}return function(a,d){var e=a.length;if(!d||isNaN(d)){d=b}if(e===0){return a}angular.forEach(a,function(b,e){if(angular.isArray(b.topArticles)&&b.topArticles.length>0){for(var f=b.topArticles.length-1;f>=0;f--){a[e].topArticles[f].contentText=c(b.topArticles[f].contentText,d)}}});return a}}]).filter("ArticlesByCateWordLimit",["browserHelp",function(a){var b=a.defultContentWidth;function c(a,b){if(a.length>b){return a.slice(0,b)+"..."}return a}return function(a,d){var e=a.length;if(!d||isNaN(d)){d=b}if(e===0){return a}angular.forEach(a,function(b,e){a[e].contentText=c(b.contentText,d)});return a}}]);"use strict";angular.module("theOneBlog").factory("dataSave",["$http","$q",function(a,b){function c(c){var d=b.defer();a.get("/search/"+c).success(function(a){d.resolve(a)}).error(function(a){d.reject(a)});return d.promise}function d(a){var b=[];if(!angular.isArray(a)){return b}angular.forEach(a,function(a){if(a.cate&&a.cate._id){for(var c=0;c<b.length;c++){if(a.cate._id===b[c]._id){b[c].resultNum++;return}}a.cate.resultNum=1;b.push(a.cate);return}});return b}function e(c,d){if(!d||isNaN(d)){d=1}var e=b.defer();a.get("/article/cate/"+c+"/"+d).success(function(a){e.resolve(a)}).error(function(a){e.reject(a)});return e.promise}function f(){var c=b.defer();a.get("/home/index/list").success(function(a){c.resolve(a)}).error(function(a){c.reject(a)});return c.promise}function g(){var c=b.defer();a.get("/home/cate/index").success(function(a){c.resolve(a)}).error(function(a){c.reject(a)});return c.promise}return{search:function(a){return c(a)},getCates:function(a){return d(a)},getHomeList:function(){return f()},getIndexCates:function(){return g()},getArticleByCateList:function(a,b){return e(a,b)}}}]).config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/");a.state("main",{url:"/",views:{header:{templateUrl:"/angular/views/home/header.html"},banner:{templateUrl:"/angular/views/home/banner.html"},bodyer:{templateUrl:"/angular/views/home/main.html",controller:"MainArticleCtrl"},"affix@main":{templateUrl:"/angular/views/home/affix.html",controller:"MainAffixCtrl"},mobileRight:{templateUrl:"/angular/views/home/mobile/right.html"}},resolve:{indexList:["dataSave",function(a){return a.getHomeList()}],cateList:["dataSave",function(a){return a.getIndexCates()}]}}).state("main.cate",{url:"cate/:cate/:page",views:{"banner@":{templateUrl:"/angular/views/home/article/article.banner.html"},"bodyer@":{templateUrl:"/angular/views/home/cate/cate.list.html",controller:"CateListCtrl"}},resolve:{articlesByCate:["$stateParams","dataSave",function(a,b){return b.getArticleByCateList(a.cate,a.page)}],curpage:["$stateParams",function(a){return isNaN(a.page)?1:a.page}]}}).state("main.article",{"abstract":true,url:"article",views:{"banner@":{templateUrl:"/angular/views/home/article/article.banner.html"}}}).state("main.article.single",{url:"/id/:id",views:{"bodyer@":{templateUrl:"/angular/views/home/article/article.html",controller:"ArticleCtrl"}},resolve:{article:["$stateParams","$http",function(a,b){return b.get("/article/id/"+a.id).success(function(a){return a})}]}}).state("main.search",{"abstract":true,url:"search",views:{"banner@":{templateUrl:"/angular/views/home/article/article.banner.html"}}}).state("main.search.goanything",{url:"/:searchWord",views:{"bodyer@":{templateUrl:"/angular/views/home/search/search.bodyer.html",controller:"SearchCtrl"}},resolve:{result:["$stateParams","dataSave",function(a,b){return b.search(a.searchWord)}],searchWord:["$stateParams",function(a){return a.searchWord}],resultCase:["result","dataSave",function(a,b){var c=b.getCates(a);return c}]}})}]);"use strict";angular.module("theOneBlog").factory("dataServer",["$http",function(a){var b={updatetime:"",data:[]};function c(c,d,e){a({method:"GET",data:"JSON",url:c}).success(function(a){b.updatetime=Date.parse(new Date);b.data=a;d(a)}).error(function(a){e(a)})}return{getlistCall:function(a,d,e){if(b&&b.data&&b.data.length>0){return d(b.data)}else{return c(a,d,e)}}}}]).controller("MainCtrl",["$scope","$location",function(a,b){a.view={scrollLeft:false};a.search={keyWord:""};a.goSearch=function(){if(!a.search.keyWord){return}b.path("/search/"+a.search.keyWord)};a.trunCollapsed=function(){a.view.scrollLeft=!a.view.scrollLeft}}]).controller("MainArticleCtrl",["$scope","$filter","dataServer","indexList",function(a,b,c,d){a.indexList=b("IndexArticlesWordlimit")(d)}]).controller("MainAffixCtrl",["$scope","indexList",function(a,b){a.cates=b}]).controller("CarouselCtrl",["$scope",function(a){a.myInterval=5e3;var b=a.slides=[];a.addSlide=function(){var a=1200;b.push({img:"http://lorempixel.com/"+a+"/305/nature/"+b.length,text:"test"})};for(var c=0;c<4;c++){a.addSlide()}}]).controller("ArticleCtrl",["$scope","$http","$stateParams","$timeout","$filter","article",function(a,b,c,d,e,f){f.data.updateTime=e("date")(f.data.updateTime,"yyyy-MM-dd");a.article=f.data;a.$watch("article.content",function(){d(function(){prettyPrint()},0)});a.pageClass="page"}]).controller("SearchCtrl",["$scope","$timeout","$filter","result","searchWord","resultCase",function(a,b,c,d,e,f){c("keywordPointFilter")(d,e);a.search.keyWord=e;a.search.resultList=d;a.pageClass="search";a.filterCate="";a.setFilter=function(b){var e=d;a.filterCate=b;e=c("filter")(e,b);a.search.resultList=e};b(function(){a.search.menuKinds=f},0)}]).controller("CateListCtrl",["$scope","$filter","articlesByCate","curpage",function(a,b,c,d){a.pageNav={maxSize:5,bigTotalItems:c.cate.articleNum,bigCurrentPage:d};a.articleList=b("ArticlesByCateWordLimit")(c.articleList);a.cate=c.cate}]);