module.exports = {


  friendlyName: 'Add todo',


  description: '',


  inputs: {

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

    expectedCompleteDate: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment of this item\'s expected completion.',
    },
  },


  exits: {

  },


  fn: async function (inputs) {

    // Create a new "thing" record.
    var newTodo = await Todo.create({
      topic: inputs.topic,
      description: inputs.description,
      owner: this.req.me.id
    }).fetch();

    // All done.
    return;

  }


};
