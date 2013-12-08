
function Service() {}

Service.prototype = {

    menuChangeCallbacks: [],
    menuChooseCallbacks: [],

    registerMenuChangeCallback: function (callback) {
        this.menuChangeCallbacks.push(callback);
    },

    registerMenuChooseCallback: function (callback) {
        this.menuChooseCallbacks.push(callback);
    },

    _notifyObservers: function (observers, data) {
        angular.forEach(observers, function (callback) {
            callback(data);
        });
    },

    entries: [],

    updateEntries: function (entries, selected) {
        this.entries = entries;
        this._notifyObservers(this.menuChangeCallbacks, { entries: entries, selected: selected });
    },

    chooseEntry: function (entry) {
        this._notifyObservers(this.menuChooseCallbacks, entry);
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

            MenuService.registerMenuChangeCallback(function (update) {
                $scope.menus = update.entries;
                $scope.$apply();
            });

            $scope.chooseMenu = function (menu) {
                MenuService.chooseEntry(menu);
            }

        }]);

    angular.bootstrap($('#menu').get()[0], ['Menu']);
});