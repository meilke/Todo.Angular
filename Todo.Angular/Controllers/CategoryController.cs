using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Todo.Angular.Controllers
{
    public class Todo
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public bool Done { get; set; }
        public int CategoryId { get; set; }
    }

    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int TodoCount { get; set; }
    }

    public class CategoryController : ApiController
    {
        internal static readonly List<Category> Categories = new List<Category> { 
            new Category { Id = 1, Name = "First Category From API" } ,
            new Category { Id = 2, Name = "Second Category From API" } ,
        };

        // GET api/category
        public IEnumerable<Category> Get()
        {
            foreach (var category in Categories)
            {
                category.TodoCount = TodoController.Todos.Count(t => t.CategoryId == category.Id);
                yield return category;
            }
        }

        // GET api/category/5
        public Category Get(int id)
        {
            return Categories.FirstOrDefault(c => c.Id == id);
        }

        // POST api/category
        public Category Post([FromBody]Category value)
        {
            value.Id = Categories.Select(c => c.Id).Max() + 1;
            Categories.Add(value);
            return value;
        }

        // PUT api/category/5
        public void Put(int id, [FromBody]Category value)
        {
        }

        // DELETE api/category/5
        public void Delete(int id)
        {
            Categories.Remove(Categories.First(c => c.Id == id));
        }
    }

    public class TodosFromCategoryController : ApiController
    {
        [HttpGet]
        public IEnumerable<Todo> Todos(int id)
        {
            return TodoController.Todos.Where(t => t.CategoryId == id);
        }
    }
}
