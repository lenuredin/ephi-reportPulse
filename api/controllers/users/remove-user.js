module.exports = {


  friendlyName: 'Remove user',


  description: '',


  inputs: {
    user: {
      description: 'The user to be deleted.',
      type: 'json',
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


  fn: async function ({user}) {

    // Verify permissions.
    // if(todoToDestroy.owner !== this.req.me.id) {
    //   throw 'forbidden';
    // }

    // destroy and fetch form records
    var recordToDestroy = await User.destroy({ id: user.id }).fetch();

    // Ensure the thing still exists.
    if(!recordToDestroy) {
      throw 'notFound';
    }

    // if recrod still exists
    if (recordToDestroy) {
      // archinve the record in public schema
      await Backup.create({ table: 'user', record: user }).meta({ schemaName: 'archive' });
    }

  }


};
