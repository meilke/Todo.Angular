angular.element(document).ready(function () {

    angular
        .module('App', ['Components'])
        .controller('InnerAppController', ['$scope', '$filter', 'MenuService', function ($scope, $filter, MenuService) {

            MenuService.registerMenuChooseCallback(function (category) {
                $scope.category = category;

                var todosFromCategory = $filter('filter')($scope.todos, { categoryId: $scope.category.id });
                $scope.currentTodos = todosFromCategory;

                $scope.$apply();
            });

            $scope.categories = [
                {id: 1, name: 'First Category', todoCount: 1}
            ];

            MenuService.updateEntries($scope.categories);

            $scope.todos = [
                { id: 1, text: 'First Task', categoryId: 1, done: false }
            ];

            $scope.category = $scope.categories[0];

            var todosFromCategory = $filter('filter')($scope.todos, { categoryId: $scope.category.id });
            $scope.currentTodos = todosFromCategory;

            $scope.addTodo = function () {
                $scope.todos.push({ text: $scope.todoText, done: false, categoryId: $scope.category.id });

                var todosFromCategory = $filter('filter')($scope.todos, { categoryId: $scope.category.id });
                var todosFromCategoryCount = todosFromCategory.length;

                $scope.category.todoCount = todosFromCategoryCount;
                $scope.todoText = '';

                $scope.currentTodos = todosFromCategory;

                MenuService.updateEntries($scope.categories);
            };

            $scope.addCategory = function () {

                var sortedCategories = $filter('filter')($scope.categories, function (category) { return category.id; });
                var newCategory = { id: sortedCategories[sortedCategories.length - 1].id + 1, name: $scope.categoryText, todoCount: 0 }

                $scope.categories.push(newCategory);
                $scope.category = newCategory;

                var todosFromCategory = $filter('filter')($scope.todos, { categoryId: $scope.category.id });
                $scope.currentTodos = todosFromCategory;

                MenuService.updateEntries($scope.categories);

                $scope.categoryText = '';
            };

            $scope.remaining = function () {
                var count = 0;
                angular.forEach($scope.currentTodos, function (todo) {
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

