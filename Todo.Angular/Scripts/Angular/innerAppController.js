function InnerAppController($scope, $filter, $resource, MenuService) {

    this.scope = $scope;
    this.filter = $filter;
    this.resource = $resource;
    this.menuService = MenuService;

    this.init();

    this.scope.addTodo = angular.bind(this, this.addTodo);
    this.scope.archive = angular.bind(this, this.deleteDoneTodos);
    this.scope.addCategory = angular.bind(this, this.addCategory);
    this.scope.toggleDone = angular.bind(this, this.toggleDone);
    this.scope.isDone = angular.bind(this, this.isDone);

    return (this);
}

InnerAppController.prototype = {
    init: function () {

        this.categoryResource = this.resource('/api/Category/:categoryId', { categoryId: '@Id' });
        this.todoResource = this.resource('/api/Todo/:todoId', { todoId: '@Id' });
        this.todosFromCategoryResource = this.resource('/api/TodosFromCategory/:categoryId', { categoryId: '@Id' });

        this.categoryResource.query(angular.bind(this, function (categories) {
            this.updateCategoriesFromResource(categories);
        }));

        this.menuService.registerMenuChooseCallback(angular.bind(this, this.switchCategory));
    },

    updateCategoriesFromResource: function (categories, selected) {
        this.categories = categories;
        
        if (!selected) {
            this.category = this.categories[0];
        } else {
            this.category = this.filter('filter')(this.categories, { Id: selected })[0];
        }

        this.menuService.updateEntries(this.categories, this.category);

        this.todosFromCategoryResource.query({ categoryId: this.category.Id }, angular.bind(this, this.updateTodosFromResource));
    },

    switchCategory: function (category) {
        this.category = category;
        this.todosFromCategoryResource.query({ categoryId: this.category.Id }, angular.bind(this, this.updateTodosFromResource));
        this.scope.$apply();
    },

    updateTodosFromResource: function (todos) {
        this.scope.currentTodos = todos;
    },

    addTodo: function () {
        var newTodo = new this.todoResource({Text: this.scope.todoText, Done: false, CategoryId: this.category.Id});
        newTodo.$save(angular.bind(this, function (todo) {
            this.categoryResource.query(angular.bind(this, function (categories) {
                this.updateCategoriesFromResource(categories, this.category.Id);
            }));
        }));

        this.scope.todoText = '';
    },

    deleteDoneTodos: function () {
        var resConstructor = this.todoResource;
        angular.forEach(this.scope.currentTodos, function (todo) {
            if (todo.Done) {
                var todoRes = new resConstructor({ Id: todo.Id });
                todoRes.$delete();
            }
        });

        this.updateCategoriesFromResource(this.categories, this.category.Id);
    },

    addCategory: function () {
        var newCategory = new this.categoryResource({ Name: this.scope.categoryText });
        newCategory.$save(angular.bind(this, function (category) {
            this.categoryResource.query(angular.bind(this, function (categories) {
                this.updateCategoriesFromResource(categories, category.Id);
            }));
        }));

        this.scope.categoryText = '';
    },

    toggleDone: function (todo) {
        var adjustedTodo = new this.todoResource({ Text: todo.Text, Done: !todo.Done, CategoryId: todo.CategoryId, Id: todo.Id });
        adjustedTodo.$save(angular.bind(this, function (todo) {

            this.categoryResource.query(angular.bind(this, function (categories) {
                this.updateCategoriesFromResource(categories, this.category.Id);
            }));

        }));
    },

    isDone: function (todo) {
        return todo.Done;
    },

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