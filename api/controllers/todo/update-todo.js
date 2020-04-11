module.exports = {


  friendlyName: 'Update todo',


  description: '',


  inputs: {

    id: {
      type: 'number',
      description: 'autoincrementing record ID',
      required:true
    },

    topic: {
      type: 'string',
      description: 'A (very) brief description of the item.',
      required:true
    },

    description: {
      type: 'string',
      description: 'A longer description of the item.',
      required:true
    },

    complete: {
      type: 'boolean',
      description: 'Status of the todo item',
    },

    expectedCompleteDate: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment of this item\'s expected completion.',
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


  fn: async function (inputs) {

    var todoToUpdate = await Todo.findOne({ id: inputs.id });

    // Ensure the thing still exists.
    if(!todoToUpdate) {
      throw 'notFound';
    }
    // Verify permissions.
    if(todoToUpdate.owner !== this.req.me.id) {
      throw 'forbidden';
    }

    // Update the `thing` record.
    await Todo.update({ id: inputs.id }).set({
      topic: inputs.topic,
      description: inputs.description,
      complete:  inputs.complete,
      expectedCompleteDate: inputs.expectedCompleteDate
    });

  }


};
