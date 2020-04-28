module.exports = {


  friendlyName: 'View signup',


  description: 'Display "Signup" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/entrance/signup',
    },

    redirect: {
      description: 'The requesting user is already logged in.',
      responseType: 'redirect'
    }

  },


  fn: async function () {

    // Return positions && admin lists for selection

    // EPHI PHEM responsibilities
    var positions =[
      'Federal Surveillance Officer',
      'Regional Surveillance Officer',
      'Zonal Surveillance Officer',
      'Woreda Surveillance Officer'
    ];

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

    if (this.req.me) {
      throw {redirect: '/'};
    }

    return {
      positions: positions,
      admin1List: admin1,
      admin2List: admin2,
      admin2ListFilter: admin2,
      admin3List: admin3,
      admin3ListFilter: admin3,
    };

  }


};
