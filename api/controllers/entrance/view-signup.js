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

    // Return admin lists for selection

    // admin1
    var admin1 = await eth_admin_1.find({
      where: {},
      select: [ 'admin1pcode', 'admin1name' ]
    }).meta({ schemaName: 'admin' });

    // admin2
    var admin2 = await eth_admin_2.find({
      where: {},
      select: [ 'admin2pcode', 'admin2name' ]
    }).meta({ schemaName: 'admin' });

    // admin3
    var admin3 = await eth_admin_3.find({
      where: {},
      select: [ 'admin3pcode', 'admin3name' ]
    });

    if (this.req.me) {
      throw {redirect: '/'};
    }

    return {
      admin1: admin1,
      admin2: admin2,
      admin3: admin3,
    };

  }


};
