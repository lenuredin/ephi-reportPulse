module.exports = {


  friendlyName: 'View todo',


  description: 'Display "Todo" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/todo/todo'
    },

    notFound: {
      responseType: 'notFound'
    },

  },


  fn: async function () {

    // empty by default
    var todo = {};

    // if params has todo ID
    if ( this.req.params.id !== 'new' ) {
      // Get the list of things this user can see.
      todo = await Todo.findOne({ id: this.req.params.id });
      if (!todo) {
        throw 'notFound';
      }
    }

    // Respond with view.
    return {
      currentSection: 'todo',
      todo: todo
    };

  }


};
