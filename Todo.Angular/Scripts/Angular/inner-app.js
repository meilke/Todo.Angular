angular.element(document).ready(function () {

    angular
        .module('App', ['Components'])
        .controller('InnerAppController', ['$scope', '$filter', 'MenuService', InnerAppController]);

    angular.bootstrap($('#inner').get()[0], ['App']);
});

