angular.element(document).ready(function () {

    angular
        .module('App', ['ngResource', 'Components'])
        .controller('InnerAppController', ['$scope', '$filter', '$resource', 'MenuService', InnerAppController]);

    angular.bootstrap($('#inner').get()[0], ['App']);
});

