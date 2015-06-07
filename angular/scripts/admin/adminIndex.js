"use strict";var ngApp;ngApp=angular.module("theoneApp",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ui.router","ngGrid","ui.bootstrap","ui.tinymce","ngTagsInput","ngSanitize","ngTouch","angularFileUpload"]);"use strict";angular.module("theoneApp").directive("previewImg",["$window",function(a){var b={support:!!(a.FileReader&&a.CanvasRenderingContext2D),isFile:function(b){return angular.isObject(b)&&b instanceof a.File},isImage:function(a){var b="|"+a.type.slice(a.type.lastIndexOf("/")+1)+"|";return"|jpg|png|jpeg|bmp|gif|".indexOf(b)!==-1}};return{restrict:"A",scope:{mypreview:"="},template:"<canvas/>",link:function(a,c,d){var e=new FileReader;var f=c.find("canvas");var g=a.$eval(d.previewImg);var h=true;if(!b.support){h=false}if(!h){c.empty().html("<img />");f=c.find("img")}a.$watch("mypreview",function(){if(!b.isFile(a.mypreview)){return}if(!b.isImage(a.mypreview)){return}e.onload=i;e.readAsDataURL(a.mypreview)});function i(a){var b=new Image;b.onload=j;b.src=a.target.result}function j(){var a=g.width||this.width/this.height*g.height;var b=g.height||this.height/this.width*g.width;f.attr({width:a,height:b});if(h){f[0].getContext("2d").drawImage(this,0,0,a,b)}else{f.attr({src:angular.element(this).attr("src")})}}}}}]).directive("fileChange",["$parse",function(a){return{restrict:"A",link:function(b,c,d){var e=a(d.fileChange);var f=function(a){b.$apply(function(){e(b,{$event:a,files:a.target.files})})};c[0].addEventListener("change",f,false)}}}]);"use strict";angular.module("theoneApp").config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/");a.state("home",{url:"/",views:{"":{templateUrl:"/angular/views/admin/index.html"}}}).state("cate",{url:"/cate",views:{"":{templateUrl:"/angular/views/admin/cate.html"}}}).state("article",{url:"/article",views:{"":{templateUrl:"/angular/views/admin/article_list.html"}}}).state("article.add",{url:"/add",views:{"@":{templateUrl:"/angular/views/admin/article.add.html"}}}).state("article.edit",{url:"/edit/:id",views:{"@":{templateUrl:"/angular/views/admin/article.edit.html",controller:"ArticleEditController"}}}).state("tag",{url:"/tag",views:{"@":{templateUrl:"/angular/views/admin/tag.list.html",controller:"TagListController"}}}).state("carousel",{url:"/carousel",views:{"@":{templateUrl:"/angular/views/admin/carousel.list.html",controller:"CarouselCtrl"}}})}]);"use strict";angular.module("theoneApp").factory("adminModalService",["$http","$modal",function(a,b){var c="";var d=function(a){var c=b.open(a);c.result.then(function(a){console.log(a)})};var e=function(b){return a.delete(b)};var f=function(b,c){return a.put(b,c)};var g=function(b){return a.get(b)};var h=function(b,c){return a.post(b,c)};return{current:function(){return c},cateList:function(a){return g(a)},modalOpen:function(a,b){c="";if(b){c=b}return d(a)},getId:function(a){return g(a)},delId:function(a){return e(a)},putNew:function(a,b){return f(a,b)},getlist:function(a){return g(a)},postlist:function(a,b){return h(a,b)},doEdit:function(a,b){return h(a,b)}}}]).factory("UiTool",[function(){return{tagInput2arr:function(a,b){var c=[];if(!angular.isArray(a)){return false}if(a.length>0){angular.forEach(a,function(a){c.push(a.text)})}if(angular.isString(b)){return c.join()}if(angular.isArray(b)){return c}return c}}}]).factory("tinymceService",[function(){return{options:{menubar:true,theme:"modern",plugins:"pagebreak,link,table,save,insertdatetime,preview,media,searchreplace,contextmenu,paste,directionality,noneditable,visualchars,nonbreaking,template,code,hr,prettify,tabset,image",toolbar:"insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | prettify | tabset | hr",content_css:"/public/css/admin/tinymceCommon.css",extended_valid_elements:"tab[heading],tabset[justified]",custom_elements:"tab,tabset",language:"zh_CN"}}}]);angular.module("theoneApp").controller("CateController",["$scope","$http","$modal","adminModalService",function(a,b,c,d){a.tableName="类别表";a.filterOptions={filterText:"",useExternalFilter:true};a.totalServerItems=0;a.pagingOptions={pageSizes:[5,10,20],pageSize:6,currentPage:1};a.setPagingData=function(b,c,d){var e=b.slice((c-1)*d,c*d);a.myData=e;a.totalServerItems=b.length;if(!a.$$phase){a.$apply()}};a.getPagedDataAsync=function(c,d,e){setTimeout(function(){var f;if(e){var g=e.toLowerCase();b.get("/angular/data/typeList.json").success(function(b){f=b.filter(function(a){return JSON.stringify(a).toLowerCase().indexOf(g)!==-1});a.setPagingData(f,d,c)})}else{b.get("/admin/cate").success(function(b){a.setPagingData(b,d,c)})}},100)};a.getPagedDataAsync(a.pagingOptions.pageSize,a.pagingOptions.currentPage);a.$watch("pagingOptions",function(b,c){if(b!==c&&b.currentPage!==c.currentPage){a.getPagedDataAsync(a.pagingOptions.pageSize,a.pagingOptions.currentPage,a.filterOptions.filterText)}},true);a.gridOptions={data:"myData",columnDefs:[{displayName:"ID",width:60,pinnable:false,sortable:false,cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.rowIndex+1}}</span></div>'},{field:"name",displayName:"名称"},{field:"articleNum",displayName:"文章数量"},{field:"updateTime",displayName:"更新时间",cellFilter:'date:"yyyy-MM-dd"'},{field:"_id",displayName:"操作",cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text><a href="javascript:;" ng-click="editOpen(row.entity._id)" >操作</a>&nbsp;<a href="javascript:;" cateid={{row["entity"]["_id"]}} ng-click="delOpen(row.entity._id)" >删除</a></span></div>'}],showGroupPanel:false,showFooter:true,enablePaging:true,enableRowSelection:true,multiSelect:false,pagingOptions:a.pagingOptions,filterOptions:a.filterOptions};a.open=function(a){d.modalOpen({templateUrl:"/angular/views/modal/cate.add.html",size:a,controller:"AddCateController",backdropClass:"heightfull"})};a.delOpen=function(a){d.modalOpen({templateUrl:"/angular/views/modal/cate.del.html",controller:"DelCateController",backdropClass:"heightfull"},a)};a.editOpen=function(a){d.modalOpen({templateUrl:"/angular/views/modal/cate.edit.html",controller:"EditCateController",size:"large",backdropClass:"heightfull"},a)}}]).controller("AddCateController",["$scope","$modalInstance","$http","adminModalService",function(a,b,c,d){a.cate={name:"",alias:"",pid:""};d.cateList("/admin/cate/all").success(function(b){a.parentCates=b});a.ok=function(){if(a.pid&&a.pid._id){a.pid=a.pid._id}c.put("/admin/cate/add",{cate:a.cate}).success(function(a,c){console.log(a);console.log(c);b.close("is_ok")}).error(function(a,c){console.log(a);console.log(c);b.close()})};a.cancel=function(){console.log("close");b.dismiss()}}]).controller("DelCateController",["$scope","$modalInstance","adminModalService",function(a,b,c){var d=c.current();a.cate={};c.getId("/admin/cate/id/"+d).success(function(b){a.cate=b});a.ok=function(){c.delId("/admin/cate/id/"+d).success(function(a){b.close()})};a.cancel=function(){b.dismiss()}}]).controller("EditCateController",["$scope","$http","$modalInstance","adminModalService",function(a,b,c,d){var e=d.current();a.cate={};d.getId("/admin/cate/id/"+e).success(function(b){a.cate=b});b.get("/admin/article/cate/"+e).success(function(b){a.articles=b});a.toggleSelection=function f(b){var c=a.cate.topArticles.indexOf(b);if(c>-1){a.cate.topArticles.splice(c,1)}else{a.cate.topArticles.push(b)}};a.save=function(){b.post("/admin/cate/edit/id/"+e,{cate:a.cate}).success(function(a){c.close()})};a.cancel=function(){c.dismiss()}}]).controller("ArticleController",["$scope","$http","$filter","$timeout","adminModalService",function(a,b,c,d,e){var f="";a.tableName="文章列表";a.anywords=[];e.getlist("/admin/tag/list").success(function(b){a.anywords=c("getSingleFiled")(b,"name")});a.filterOptions={filterText:"",useExternalFilter:true};a.pagingOptions={pageSizes:[10,15,20],currentPage:1,pageSize:10};a.setPagingData=function(b,c,d){var e=b;a.myData=e;if(!a.$$phase){a.$apply()}};a.getPagedDataAsync=function(b,c,d){var f,g={page:c,pageSize:b,searchText:d};if(d){var h=d.toLowerCase();e.postlist("/admin/article/list",g).success(function(d){f=d.filter(function(a){return JSON.stringify(a).toLowerCase().indexOf(h)!==-1});a.setPagingData(f,c,b)})}else{e.postlist("/admin/article/list",g).success(function(d){a.setPagingData(d,c,b)})}};a.getPagedDataAsync(a.pagingOptions.pageSize,a.pagingOptions.currentPage);a.$watch("pagingOptions",function(b,c){if(b!==c&&b.currentPage!==c.currentPage){a.getPagedDataAsync(a.pagingOptions.pageSize,a.pagingOptions.currentPage,a.filterOptions.filterText)}},true);a.$watch("goany",function(b,c){if(typeof b==="string"){b=b.toLowerCase()}if(typeof c==="string"){c=c.toLowerCase()}if(b===c){return}if(f){d.cancel(f)}f=d(function(){a.filterOptions.filterText=b;a.pagingOptions.currentPage=1;a.getPagedDataAsync(a.pagingOptions.pageSize,a.pagingOptions.currentPage,a.filterOptions.filterText)},500)},false);a.filterOptions={name:"123"};a.gridOptions={data:"myData",columnDefs:[{field:"_id",displayName:"ID",width:60,pinnable:false,sortable:false,cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><span>{{row.rowIndex+1}}</span></div>'},{field:"title",displayName:"标题"},{field:"keyWords",displayName:"关键词"},{field:"updateTime",displayName:"更新时间",cellFilter:'date:"yyyy-MM-dd"'},{displayName:"操作",cellTemplate:'<div class="ngCellText"><a ng-href="#/article/edit/{{row.entity._id}}">编辑</a> &nbsp; <a href="javascript:;" ng-click="delOpen(row.entity._id)">删除</a></div>'}],showGroupPanel:false,showFooter:true,enablePaging:true,enableRowSelection:true,multiSelect:false,pagingOptions:a.pagingOptions,filterOptions:a.filterOptions};a.delOpen=function(a){e.modalOpen({templateUrl:"/angular/views/modal/article.del.html",controller:"DelArticleController",backdropClass:"heightfull"},a)}}]).controller("DelArticleController",["$scope","$modalInstance","adminModalService",function(a,b,c){var d;d=c.current();c.getId("/admin/article/id/"+d).success(function(b){a.article=b});a.ok=function(){c.delId("/admin/article/id/"+d).success(function(a){console.log(a)});b.close()};a.cancel=function(){b.dismiss()}}]).controller("ArticleAddController",["$scope","adminModalService","tinymceService","UiTool",function(a,b,c,d){a.tableName="添加文章";a.keyWords=[];function e(){a.newArticle={title:"",cate:"",keyWords:[],content:""}}e();b.cateList("/admin/cate/all").success(function(b){a.cates=b});a.ok=function(){if(a.newArticle.cate){a.newArticle.cate=a.newArticle.cate._id}a.newArticle.keyWords=d.tagInput2arr(a.keyWords,[]);b.putNew("/admin/article/add",{article:a.newArticle}).success(function(a){console.log(a);e()})};a.tinymceOptions=c.options}]).controller("ArticleEditController",["$scope","$stateParams","adminModalService","tinymceService","UiTool",function(a,b,c,d,e){var f;a.tableName="编辑文章";a.article={};c.cateList("/admin/cate/all").success(function(b){a.cates=b});c.getId("/admin/article/id/"+b.id).success(function(b){a.article=b;f=b});a.tinymceOptions=d.options;a.ok=function(){if(a.article.cate){a.article.cate=a.article.cate._id}a.article.keyWords=e.tagInput2arr(a.article.keyWords,[]);a.article.author=a.article.author._id;c.doEdit("/admin/article/edit",{article:a.article}).success(function(a){console.log(a)})}}]).controller("TagListController",["$scope","adminModalService",function(a,b){a.tableName="标签列表";a.tags=[];b.getlist("/admin/tag/list").success(function(b){a.tags=b})}]).controller("CarouselCtrl",["$scope","$http","adminModalService",function(a,b,c){a.h1Title="首页Carsouel设置";a.tableName="首页幻灯片列表";a.carouselList=[];a.open=function(a){c.modalOpen({templateUrl:"/angular/views/modal/carousel.add.html",size:a,controller:"AddCarouselCtrl",backdropClass:"heightfull"})};a.uploadCloud=function(a){b.get("/admin/carousel/upClould/"+a).success(function(a){d()})};a.delCloud=function(a){b.get("/admin/carousel/delClould/"+a).success(function(a){d()})};a.changeStatus=function(a){b.get("/admin/carousel/changStatus/"+a).success(function(a){d()})};a.singleRemove=function(a){b.delete("/admin/carousel/del/"+a).success(function(a){d()})};function d(){b.get("/admin/carousel/list").success(function(b){a.carouselList=b})}d()}]).controller("AddCarouselCtrl",["$scope","$modalInstance","FileUploader",function(a,b,c){a.position=1;a.imgTitle="";a.imgDesc="";var d=a.uploader=new c({url:"/admin/carousel/add",method:"put",alias:"carousel",queueLimit:2});d.filters.push({name:"onlyOne",fn:function(){var a=d.queue.length;if(a){d.clearQueue()}return true}});d.onAfterAddingFile=function(b){a.mypreview=b._file};a.$watch("position",function(){d.formData[0]={position:a.position}});a.$watch("imgTitle",function(){d.formData[1]={imgTitle:a.imgTitle}});a.$watch("imgDesc",function(){d.formData[2]={imgDesc:a.imgDesc}});a.upload=function(){d.uploadItem(0);b.close()};a.cancel=function(){b.dismiss()}}]);"use strict";angular.module("theoneApp").filter("getSingleFiled",function(){return function(a,b){var c=[],d=a.length;if(!d||d===0){return c}angular.forEach(a,function(a){if(a[b]){c[c.length]=a[b]}});return c}});