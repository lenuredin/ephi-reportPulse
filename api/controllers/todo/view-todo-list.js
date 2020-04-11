module.exports = {


  friendlyName: 'View todo list',


  description: 'Display "Todo list" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/todo/todo-list'
    }

  },


  fn: async function () {

    // Get the list of things this user can see.
    var todo = await Todo.find({ owner: this.req.me.id });

    // Respond with view.
    return {
      currentSection: 'todo',
      todo: todo
    };

  }


};
