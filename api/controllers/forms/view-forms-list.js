var FormsList = {


  friendlyName: 'View forms list',


  description: 'Display "Forms list" page.',


  exits: {

    notFound: {
      responseType: 'notFound'
    },

    forbidden: {
      responseType: 'forbidden'
    },

    success: {
      viewTemplatePath: 'pages/forms/forms-list'
    }

  },

  // return sails model
  parseModel: function(request) {
    request = request.toLowerCase();
    return sails.models[request];
  },


  // run function
  fn: async function () {

    // check valid user
    if (this.req.me.emailStatus !== 'confirmed') {
      throw 'forbidden';
    }

    // fetch params
    var id = this.req.params.id;
    // set default to all
    var admin1pcode = this.req.params.admin1pcode ? this.req.params.admin1pcode : 'all';
    var admin2pcode = this.req.params.admin2pcode ? this.req.params.admin2pcode : 'all';
    var admin3pcode = this.req.params.admin3pcode ? this.req.params.admin3pcode : 'all';

    // fetch form
    var form = await _form_info.findOne({ id: id }).meta({ schemaName: 'phem' });

    // exit if no form found
    if(!form) {
      throw 'notFound';
    }


    // model_name
    var model_name = form.form_name.replace(/ /g, '_') + '_core';
    // contstruct region, zone, woreda filters
    var admin1pcode_filter = admin1pcode === 'all' ? {} : { admin1pcode: admin1pcode }
    var admin2pcode_filter = admin2pcode === 'all' ? {} : { admin2pcode: admin2pcode }
    var admin3pcode_filter = admin3pcode === 'all' ? {} : { admin3pcode: admin3pcode }

    //
    console.log( model_name );
    console.log( admin1pcode_filter );
    console.log( admin2pcode_filter );
    console.log( admin3pcode_filter );

    // fetch form records
    var odk_records = await FormsList.parseModel(model_name)
                          .find()
                          .where(admin1pcode_filter)
                          .where(admin2pcode_filter)
                          .where(admin3pcode_filter)
                          .meta({ schemaName: 'phem' });


    // admin1
    var admin1 = await eth_admin_1.find({
      where: {},
      select: [ 'admin1pcode', 'admin1name', 'admin1type_name' ]
    })
    .meta({ schemaName: 'admin' })
    .sort('admin1name ASC');

    // admin2
    var admin2 = await eth_admin_2.find({
      where: {},
      select: [ 'admin1pcode', 'admin1name', 'admin1type_name', 'admin2pcode', 'admin2name', 'admin2type_name' ]
    })
    .meta({ schemaName: 'admin' })
    .sort('admin2name ASC');

    // admin3
    var admin3 = await eth_admin_3.find({
      where: {},
      select: [ 'admin1pcode', 'admin1name', 'admin1type_name', 'admin2pcode', 'admin2name', 'admin2type_name', 'admin3pcode', 'admin3name', 'admin3type_name' ]
    })
    .meta({ schemaName: 'admin' })
    .sort('admin3name ASC');

    // health_facilities
    var adminsites = await eth_adminsites.find({
      where: {},
      select: [ 'admin1pcode', 'admin1name', 'admin1type_name', 'admin2pcode', 'admin2name', 'admin2type_name', 'admin3pcode', 'admin3name', 'admin3type_name', 'site_id', 'site_name' ]
    })
    .meta({ schemaName: 'admin' })
    .sort('site_name ASC');


    // merge admin3 keys to records
    var records = [];
    odk_records.forEach(function(record){
      // obj
      var d = {}
      // construct d
      for (var key in record) {
        d[key] = record[key];
      }
      // find admin3 params
      var admin3record = _.find(admin3, function(a) {
        return d.admin3pcode === a.admin3pcode;
      });
      // esnure records id does not get overwritted
      records.push( Object.assign(d, admin3record, { id: d.id } ) );
    });

    console.log(records);

    // Respond with view.
    return {
      currentSection: 'forms',
      form: form,
      records: records,
      admin1List: admin1,
      admin2List: admin2,
      admin3List: admin3,
      adminsitesList: adminsites
    };

  }


};

module.exports = FormsList;
