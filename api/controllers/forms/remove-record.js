var RemoveRecord = {

  friendlyName: 'Remove record',


  description: 'Removes a record from the ODK Form database',

  inputs: {

    form_name: {
      description: 'The name of the form.',
      type: 'string',
      required: true
    },

    record: {
      description: 'The record object to be deleted.',
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

  // return sails model
  parseModel: function(request) {
    request = request.toLowerCase();
    return sails.models[request];
  },


  fn: async function ({form_name, record}) {

    // model_name
    var model_name = form_name.replace(/ /g, '_') + '_core';

    // Verify permissions.
    // if(todoToDestroy.owner !== this.req.me.id) {
    //   throw 'forbidden';
    // }

    // destroy and fetch form records
    var recordToDestroy = await RemoveRecord.parseModel(model_name).destroy({ id: record.id }).fetch().meta({ schemaName: 'phem' });

    // Ensure the thing still exists.
    if(!recordToDestroy) {
      throw 'notFound';
    }

    // if recrod still exists
    if (recordToDestroy) {
      // archinve the record in public schema
      await Backup.create({ form: form_name, record: record }).meta({ schemaName: 'archive' });
    }

  }


};

module.exports = RemoveRecord;
