using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Todo.Angular.Controllers
{
    public class TodoController : ApiController
    {
        internal static readonly List<Todo> Todos = new List<Todo> { 
            new Todo { Id = 1, CategoryId = 1, Text = "First task from API", Done = false }, 
            new Todo { Id = 2, CategoryId = 1, Text = "Another task from API", Done = false },
            new Todo { Id = 3, CategoryId = 2, Text = "Another", Done = false }, 
        };

        // GET api/todo
        public IEnumerable<Todo> Get()
        {
            return Todos;
        }

        // GET api/todo/5
        public Todo Get(int id)
        {
            return Todos.FirstOrDefault(t => t.Id == id);
        }

        // POST api/todo
        public Todo Post([FromBody]Todo value)
        {
            value.Id = Todos.Select(c => c.Id).Max() + 1;
            Todos.Add(value);
            return value;
        }

        // PUT api/todo/5
        public void Put(int id, [FromBody]Todo value)
        {
        }

        // DELETE api/todo/5
        public void Delete(int id)
        {
            Todos.Remove(Todos.First(t => t.Id == id));
        }
    }
}
