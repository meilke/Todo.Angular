angular.element(document).ready(function () {

    angular
        .module('App', ['Components'])
        .controller('InnerAppController', ['$scope', 'MenuService', function ($scope, MenuService) {

            $scope.todos = [
                
            ];

            $scope.addTodo = function () {
                $scope.todos.push({ text: $scope.todoText, done: false });

                MenuService.addEntry($scope.todoText);

                $scope.todoText = '';
            };

            $scope.remaining = function () {
                var count = 0;
                angular.forEach($scope.todos, function (todo) {
                    count += todo.done ? 0 : 1;
                });
                return count;
            };

            $scope.archive = function () {
                var oldTodos = $scope.todos;
                $scope.todos = [];
                angular.forEach(oldTodos, function (todo) {
                    if (!todo.done) $scope.todos.push(todo);
                });
            };
        }]);

    angular.bootstrap($('#inner').get()[0], ['App']);
});

