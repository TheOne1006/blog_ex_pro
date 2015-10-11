"use strict";var ngApp;ngApp=angular.module("theOneBlog",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ui.router","ui.bootstrap","ngSanitize","ngTouch","mgcrea.ngStrap","angular-carousel"]).factory("browserHelp",["$window",function(a){var b=a.innerWidth,c=768;var d=180;return{isMobile:b<c,defultContentWidth:d}}]);"use strict";angular.module("theOneBlog").directive("headroom",["$window","browserHelp",function(a,b){var c=a.Headroom;if(b.isMobile){return{restrict:"EA",scope:{tolerance:"=",offset:"=",classes:"=",scroller:"="},link:function(a,b){var d={};angular.forEach(c.options,function(b,e){d[e]=a[e]||c.options[e]});if(d.scroller){d.scroller=angular.element(d.scroller)[0]}var e=new c(b[0],d);e.init();a.$on("destroy",function(){e.destroy()})}}}return{}}]).directive("onFinishRender",function(a){return{restrict:"A",link:function(b){if(b.$last===true){a(function(){b.$emit("ngRepeatFinished")})}}}}).directive("previewImg",["$window",function(a){var b={support:!!(a.FileReader&&a.CanvasRenderingContext2D),isFile:function(b){return angular.isObject(b)&&b instanceof a.File},isImage:function(a){var b="|"+a.type.slice(a.type.lastIndexOf("/")+1)+"|";return"|jpg|png|jpeg|bmp|gif|".indexOf(b)!==-1}};return{restrict:"A",scope:{mypreview:"="},template:"<canvas/>",link:function(a,c,d){var e=new FileReader;var f=c.find("canvas");var g=a.$eval(d.previewImg);var h=true;if(!b.support){h=false}if(!h){c.empty().html("<img />");f=c.find("img")}a.$watch("mypreview",function(){if(!b.isFile(a.mypreview)){return}if(!b.isImage(a.mypreview)){return}e.onload=i;e.readAsDataURL(a.mypreview)});function i(a){var b=new Image;b.onload=j;b.src=a.target.result}function j(){var a=g.width||this.width/this.height*g.height;var b=g.height||this.height/this.width*g.width;f.attr({width:a,height:b});if(h){f[0].getContext("2d").drawImage(this,0,0,a,b)}else{f.attr({src:angular.element(this).attr("src")})}}}}}]).directive("fileChange",["$parse",function(a){return{require:"ngModel",restrict:"A",link:function(b,c,d,e){var f=a(d["fileChange"]);var g=function(a){b.$apply(function(){f(b,{$event:a,files:a.target.files})})};c[0].addEventListener("change",g,false)}}}]).directive("scrollAnimate",[function(){return{restrict:"A",link:function(a,b,c){var d=c.target;b.bind("click",function(a){a.stopPropagation();var b=angular.element(d).offset().top;angular.element("body").animate({scrollTop:b})})}}}]);"use strict";angular.module("theOneBlog").filter("keywordEm",["browserHelp",function(a){var b="<em>",c="</em>",d=a.defultContentWidth,e;function f(a,d){if(a.toLowerCase()===d.toLowerCase()){return b+a+c}return a}function g(a,d,f){var g=-1;e=new RegExp(d,"i");g=a.search(e);if(f){a=h(a,g,f)}if(g!==-1){return a.replace(e,b+"$&"+c)}return a}function h(a,b,c){var d=a.length,e;if(d<=c){return a}e=Math.floor(c/2);if(b-e<=0){return a.slice(0,c)+"..."}else if(b+e>=d){return"..."+a.slice(-c)}else{return"..."+a.slice(b-e,b+e)+"..."}}return function(a,b,c,e){if(c===undefined){return a}if(!e||isNaN(e)){e=d}switch(b){case"tag":a=f(a,c);break;case"title":a=g(a,c);break;case"content":a=g(a,c,e);break;default:break}return a}}]).filter("keywordPointFilter",["$filter",function(a){return function(b,c){if(!angular.isArray(b)){return b}if(b.length===0){return[]}angular.forEach(b,function(d,e){b[e].title=a("keywordEm")(d.title,"title",c);b[e].contentText=a("keywordEm")(d.contentText,"content",c);angular.forEach(d.keyWords,function(d,f){b[e].keyWords[f]=a("keywordEm")(d,"tag",c)})});return b}}]).filter("IndexArticlesWordlimit",["browserHelp",function(a){var b=a.defultContentWidth;function c(a,b){if(a.length>b){return a.slice(0,b)+"..."}return a}return function(a,d){var e=a.length;if(!d||isNaN(d)){d=b}if(e===0){return a}angular.forEach(a,function(b,e){if(angular.isArray(b.topArticles)&&b.topArticles.length>0){for(var f=b.topArticles.length-1;f>=0;f--){a[e].topArticles[f].contentText=c(b.topArticles[f].contentText,d)}}});return a}}]).filter("ArticlesByCateWordLimit",["browserHelp",function(a){var b=a.defultContentWidth;function c(a,b){if(a.length>b){return a.slice(0,b)+"..."}return a}return function(a,d){var e=a.length;if(!d||isNaN(d)){d=b}if(e===0){return a}angular.forEach(a,function(b,e){a[e].contentText=c(b.contentText,d)});return a}}]);"use strict";angular.module("theOneBlog").factory("dataSave",["$http","$q",function(a,b){function c(c){var d=b.defer();a.get("/h/search/"+c).success(function(a){d.resolve(a)}).error(function(a){d.reject(a)});return d.promise}function d(a){var b=[];if(!angular.isArray(a)){return b}angular.forEach(a,function(a){if(a.cate&&a.cate._id){for(var c=0;c<b.length;c++){if(a.cate._id===b[c]._id){b[c].resultNum++;return}}a.cate.resultNum=1;b.push(a.cate);return}});return b}function e(c,d){if(!d||isNaN(d)){d=1}var e=b.defer();a.get("/h/article/cate/"+c+"/"+d).success(function(a){e.resolve(a)}).error(function(a){e.reject(a)});return e.promise}function f(){var c=b.defer();a.get("/home/index/list").success(function(a){c.resolve(a)}).error(function(a){c.reject(a)});return c.promise}function g(){var c=b.defer();a.get("/home/cate/index").success(function(a){c.resolve(a)}).error(function(a){c.reject(a)});return c.promise}function h(c){var d=b.defer();a.get("/h/article/total/cate/"+c).success(function(a){d.resolve(a)}).error(function(a){d.reject(a)});return d.promise}return{search:function(a){return c(a)},getCates:function(a){return d(a)},getHomeList:function(){return f()},getIndexCates:function(){return g()},getArticleByCateList:function(a,b){return e(a,b)},getArticleTotalNum:function(a){return h(a)}}}]).config(["$stateProvider","$urlRouterProvider","$locationProvider",function(a,b,c){c.html5Mode({enabled:true,requireBase:false});b.otherwise("/");a.state("main",{url:"/",views:{header:{templateUrl:"/angular/views/home/header.html"},banner:{templateUrl:"/angular/views/home/banner.html"},bodyer:{templateUrl:"/angular/views/home/main.html",controller:"MainArticleCtrl"},"affix@main":{templateUrl:"/angular/views/home/affix.html",controller:"MainAffixCtrl"},mobileRight:{templateUrl:"/angular/views/home/mobile/right.html"}},resolve:{indexList:["dataSave",function(a){return a.getHomeList()}],cateList:["dataSave",function(a){return a.getIndexCates()}]}}).state("main.cate",{url:"cate/:cate/:page",views:{"banner@":{templateUrl:"/angular/views/home/article/article.banner.html"},"bodyer@":{templateUrl:"/angular/views/home/cate/cate.list.html",controller:"CateListCtrl"}},resolve:{articlesByCate:["$stateParams","dataSave",function(a,b){return b.getArticleByCateList(a.cate,a.page)}],curpage:["$stateParams",function(a){return isNaN(a.page)?1:a.page}],totalNum:["$stateParams","dataSave",function(a,b){return b.getArticleTotalNum(a.cate)}]}}).state("main.article",{"abstract":true,url:"article",views:{"banner@":{templateUrl:"/angular/views/home/article/article.banner.html"}}}).state("main.article.single",{url:"/id/:id",views:{"bodyer@":{templateUrl:"/angular/views/home/article/article.html",controller:"ArticleCtrl"}},resolve:{article:["$stateParams","$http",function(a,b){return b.get("/h/article/id/"+a.id).success(function(a){return a})}]}}).state("main.search",{"abstract":true,url:"search",views:{"banner@":{templateUrl:"/angular/views/home/article/article.banner.html"}}}).state("main.search.goanything",{url:"/:searchWord",views:{"bodyer@":{templateUrl:"/angular/views/home/search/search.bodyer.html",controller:"SearchCtrl"}},resolve:{result:["$stateParams","dataSave",function(a,b){return b.search(a.searchWord)}],searchWord:["$stateParams",function(a){return a.searchWord}],resultCase:["result","dataSave",function(a,b){var c=b.getCates(a);return c}]}})}]);"use strict";angular.module("theOneBlog").factory("dataServer",["$http","$q",function(a,b){var c={updatetime:"",data:[]};var d=[];function e(b,d,e){a({method:"GET",data:"JSON",url:b}).success(function(a){c.updatetime=Date.parse(new Date);c.data=a;d(a)}).error(function(a){e(a)})}function f(){var c=b.defer();a.get("/carousel/index/list").success(function(a){c.resolve(a)}).error(function(a){c.reject(a)});return c.promise}return{getlistCall:function(a,b,d){if(c&&c.data&&c.data.length>0){return b(c.data)}else{return e(a,b,d)}},getIndexCarousel:function(){var a=b.defer();if(d.length){a.resolve(d)}else{f().then(function(b){angular.forEach(b,function(a){d.push({img:a.imgInCloud.secure_url,text:a.imgTitle})});a.resolve(d)})}return a.promise}}}]).controller("MainCtrl",["$scope","$location",function(a,b){a.view={scrollLeft:false};a.search={keyWord:""};a.goSearch=function(){if(!a.search.keyWord){return}b.path("/search/"+a.search.keyWord)};a.trunCollapsed=function(){a.view.scrollLeft=!a.view.scrollLeft}}]).controller("MainArticleCtrl",["$scope","$filter","dataServer","indexList",function(a,b,c,d){a.indexList=b("IndexArticlesWordlimit")(d)}]).controller("MainAffixCtrl",["$scope","indexList",function(a,b){a.cates=b}]).controller("CarouselCtrl",["$scope","dataServer",function(a,b){a.myInterval=5e3;var c=a.slides=[];b.getIndexCarousel().then(function(b){if(b.length){console.log(b);a.slides=b}else{d()}});function d(){for(var b=0;b<4;b++){a.addSlide()}}a.addSlide=function(){var a=1200;c.push({img:"http://lorempixel.com/"+a+"/305/nature/"+c.length,text:"test"})}}]).controller("ArticleCtrl",["$scope","$http","$stateParams","$timeout","$filter","$templateCache","article",function(a,b,c,d,e,f,g){g.data.updateTime=e("date")(g.data.updateTime,"yyyy-MM-dd");f.put("article.content.html",g.data.content);a.article=g.data;a.$watch("article.content",function(){d(function(){prettyPrint()},0)});a.pageClass="article"}]).controller("SearchCtrl",["$scope","$timeout","$filter","result","searchWord","resultCase",function(a,b,c,d,e,f){c("keywordPointFilter")(d,e);a.search.keyWord=e;a.search.resultList=d;a.pageClass="search";a.filterCate="";a.setFilter=function(b){var e=d;a.filterCate=b;e=c("filter")(e,b);a.search.resultList=e};b(function(){a.search.menuKinds=f},0)}]).controller("CateListCtrl",["$scope","$filter","$location","$stateParams","articlesByCate","curpage","totalNum",function(a,b,c,d,e,f,g){a.pageNav={maxSize:5,itemsPerPage:12,bigTotalItems:g.total,bigCurrentPage:f,pageChanged:function(){c.path("/cate/"+d.cate+"/"+a.pageNav.bigCurrentPage,false)}};a.articleList=b("ArticlesByCateWordLimit")(e.articleList);a.cate=e.alias}]).controller("articleBannerCtrl",["$scope",function(a){var b=new Vivus("vivusTheOne",{type:"scenario-sync",duration:20,start:"autostart",dashGap:20,forceRender:false,file:"/public/svg/theoneIo.svg"});a.vireset=function(){b.reset().play()}}]);