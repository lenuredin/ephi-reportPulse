var AddUpdateRecord = {


  friendlyName: 'Update record',


  description: 'Updates a record from the ODK Form database',

  inputs: {

    form_name: {
      description: 'The name of the form.',
      type: 'string',
      required: true
    },

    record: {
      description: 'The record object to be added or updated.',
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

    // check valid user
    if (this.req.me.emailStatus !== 'confirmed') {
      throw 'forbidden';
    }

    // does the record exist?
    var recordExists = false;

    // model_name
    var model_name = form_name.replace(/ /g, '_') + '_core';

    // Verify permissions.
    // if(todoToDestroy.owner !== this.req.me.id) {
    //   throw 'forbidden';
    // }

    // does record exist?
    recordExists = await AddUpdateRecord.parseModel(model_name).findOne({ id: record.id }).meta({ schemaName: 'phem' });

    console.log( recordExists );

    // if no existing record, create
    if ( !recordExists) {
      // destroy and fetch form records
      await AddUpdateRecord.parseModel(model_name).create(record).meta({ schemaName: 'phem' });
    }

    // if existing record, update
    if ( recordExists ) {
      // destroy and fetch form records
      await AddUpdateRecord.parseModel(model_name).update({ id: record.id }, record).meta({ schemaName: 'phem' });
    }

  }


};

module.exports = AddUpdateRecord;
