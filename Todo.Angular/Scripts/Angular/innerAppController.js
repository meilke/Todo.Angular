function InnerAppController($scope, $filter, MenuService) {

    this.scope = $scope;
    this.filter = $filter;
    this.menuService = MenuService;

    this.init();

    this.scope.addTodo = angular.bind(this, this.addTodo);
    this.scope.addCategory = angular.bind(this, this.addCategory);

    return (this);
}

InnerAppController.prototype = {
    init: function () {
        this.categories = [
                { id: 1, name: 'First Category', todoCount: 1 }
        ];

        this.todos = [
                { id: 1, text: 'First Task', categoryId: 1, done: false }
        ];

        this.menuService.updateEntries(this.categories);
        this.category = this.categories[0];

        this.menuService.registerMenuChooseCallback(angular.bind(this, this.switchCategory));

        this.updateTodos();
    },

    switchCategory: function (category) {
        this.category = category;
        this.updateTodos();
        this.scope.$apply();
    },

    updateTodos: function () {
        var todosFromCategory = this.filter('filter')(this.todos, { categoryId: this.category.id });
        this.scope.currentTodos = todosFromCategory;
    },

    addTodo: function () {
        this.todos.push({ text: this.scope.todoText, done: false, categoryId: this.category.id });

        var todosFromCategory = this.filter('filter')(this.todos, { categoryId: this.category.id });
        var todosFromCategoryCount = todosFromCategory.length;

        this.category.todoCount = todosFromCategoryCount;
        this.scope.todoText = '';

        this.scope.currentTodos = todosFromCategory;

        this.menuService.updateEntries(this.categories);
    },

    addCategory: function () {

        var sortedCategories = this.filter('filter')(this.categories, function (category) { return category.id; });
        var newCategory = { id: sortedCategories[sortedCategories.length - 1].id + 1, name: this.scope.categoryText, todoCount: 0 }

        this.categories.push(newCategory);
        this.category = newCategory;

        this.updateTodos();

        this.menuService.updateEntries(this.categories);

        this.scope.categoryText = '';
    }

    //    $scope.remaining = function () {
    //        var count = 0;
    //        angular.forEach($scope.currentTodos, function (todo) {
    //            count += todo.done ? 0 : 1;
    //        });
    //        return count;
    //    };

    //    $scope.archive = function () {
    //        var oldTodos = $scope.todos;
    //        $scope.todos = [];
    //        angular.forEach(oldTodos, function (todo) {
    //            if (!todo.done) $scope.todos.push(todo);
    //        });
    //    };
}