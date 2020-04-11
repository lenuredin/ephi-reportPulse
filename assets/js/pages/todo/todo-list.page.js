parasails.registerPage('todo-list', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    todo:[],

    // show todo list
    todoItems: false,

    // show completed list
    completeItems: false,

  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
    this.todoItems = this._displayTodoList(this.todo);
    this.completeItems = this._displayCompleteList(this.todo);
  },
  mounted: async function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    // show / hide list
    _displayTodoList: function(todo) {
      var display = false;
      todo.forEach(function(d){
        if (!d.complete) {
          display = true;
        }
      });
      return display;
    },

    // show / hide list
    _displayCompleteList: function(todo) {
      var display = false;
      todo.forEach(function(d){
        if (d.complete) {
          display = true;
        }
      });
      return display;
    },

    // click add todo
    clickAddButton: function() {
      // why is this not working?
      // this.goto('/todo/new');
      window.location.href = '/todo/new';
    }
  }
});
