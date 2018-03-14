// public/js/app.js
angular.module('sampleApp', ['ngRoute','ngStorage','logInDirectives', 'appRoutes', 'LogInCtrl', 'RegisterCtrl','RouterService','ApiService','SelectService']);
angular.module('firstLogIn', ['ngRoute','ngStorage','homeDirectives','appRoutes','RegisterCtrl','RouterService','ApiService','SelectService']);
angular.module('homeApp', ['ngRoute','homeDirectives','ForumCtrl','appRoutes','ngStorage','ApiService','SelectService']);