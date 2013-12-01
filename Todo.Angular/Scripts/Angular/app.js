
function Service() {

    this.addEntries = angular.bind(this, this.addEntry);
    this.registerObserverCallback = angular.bind(this, this.registerObserverCallback);

}

Service.prototype = {

    observerCallbacks: [],
    registerObserverCallback: function (callback) {
        this.observerCallbacks.push(callback);
    },
    notifyObservers: function () {
        var e = this.entries;
        angular.forEach(this.observerCallbacks, function (callback) {
            callback(e);
        });
    },

    entries: [],
    addEntry: function (title) {
        this.entries.push(title);
        this.notifyObservers();
    }
};

angular.element(document).ready(function () {

    angular
        .module('Components', [])
        .factory('MenuService', function () {
            return new Service();
        });

    angular
        .module('Menu', ['Components'])
        .controller('MenuController', ['$scope', 'MenuService', function ($scope, MenuService) {

            MenuService.registerObserverCallback(function (entries) {
                $scope.menus = entries;
                $scope.$apply();
            });

        }]);

    angular.bootstrap($('#menu').get()[0], ['Menu']);
});