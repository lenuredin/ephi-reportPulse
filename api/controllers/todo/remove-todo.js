module.exports = {


  friendlyName: 'Remove todo',


  description: '',


  inputs: {

    id: {
      description: 'The id of the thing to destroy',
      type: 'number',
      required: true
    },

  },


  exits: {

    notFound: {
      responseType: 'notFound'
    },

    forbidden: {
      responseType: 'forbidden'
    },

  },


  fn: async function ({id}) {

    var todoToDestroy = await Todo.findOne({ id });
    // Ensure the thing still exists.
    if(!todoToDestroy) {
      throw 'notFound';
    }
    // Verify permissions.
    if(todoToDestroy.owner !== this.req.me.id) {
      throw 'forbidden';
    }

    // Archive the record.
    await Todo.archiveOne({ id });

  }


};
