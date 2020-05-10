module.exports = {


  friendlyName: 'View edit profile',


  description: 'Display "Edit profile" page.',

  inputs: {

    id: {
      description: 'The user id.',
      example: '1'
    }

  },

  exits: {

    success: {
      viewTemplatePath: 'pages/account/edit-profile',
    }

  },


  fn: async function ({id}) {

    // get id
    var userId = id ? id : this.req.me.id;

    // get user
    var user = await User.findOne({ id: userId });

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

    // return
    return {
      currentSection: 'users',
      user: user,
      positions: positions,
      admin1List: admin1,
      admin2List: admin2,
      admin3List: admin3
    }

  }


};
