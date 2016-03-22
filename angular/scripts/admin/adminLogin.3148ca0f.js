"use strict";angular.module("theOneBlogLogin",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ui.router","angularFileUpload","theOneBlogLogin.route","theOneBlogLogin.controllers","theOneBlogLogin.services"]),angular.module("theOneBlogLogin.route",[]),angular.module("theOneBlogLogin.services",[]),angular.module("theOneBlogLogin.controllers",["theOneBlogLogin.services"]),angular.module("theOneBlogLogin.route").config(["$stateProvider","$urlRouterProvider",function(a,b){a.state("webcam",{url:"/webcam",views:{"@":{templateUrl:"/angular/views/admin/login/webcam.html",controller:"LoginWebcamController"}}}),b.otherwise("/")}]),angular.module("theOneBlogLogin.controllers").controller("LoginController",["$scope","$window","$http",function(a,b,c){a.user={name:"",password:"",rember:""},a.loginSubmit=function(){c.post("/admin/login/verify/password",{user:a.user}).success(function(a){console.log(a)})}}]).controller("LoginWebcamController",["$scope","$timeout","$window","webcamService",function(a,b,c,d){a.phListArr=[],b(function(){d.readyWebcam(null,"#photo")},1e3)}]),angular.module("theOneBlogLogin.services").factory("webcamService",["$http","$window","$interval",function(a,b,c){var d,e=b.Webcam,f=[],g={width:360,height:280,dest_width:180,dest_height:140,image_format:"jpeg",jpeg_quality:90},h=function(a){angular.extend(g,a),e.set(g)},i=function(a){e.attach(a),e.on("live",function(){j()})},j=function(){d=c(function(){e.container?e.snap(function(a){f.push(a),e.upload(a,"/admin/login/verify/face",k)}):d.cancel()},5e3)},k=function(a,c){200===a&&c&&(c=JSON.parse(c),c.is_login&&(b.location="/admin"))};return{readyWebcam:function(a,b){a=a||{},h(a),i(b)},takePhotos:function(){!e.container},getWebcam:function(){return e.container}}}]);