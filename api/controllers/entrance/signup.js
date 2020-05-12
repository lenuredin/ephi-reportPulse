module.exports = {


  friendlyName: 'Signup',


  description: 'Sign up for a new user account.',


  extendedDescription:
`This creates a new user record in the database, signs in the requesting user agent
by modifying its [session](https://sailsjs.com/documentation/concepts/sessions), and
(if emailing with Mailgun is enabled) sends an account verification email.

If a verification email is sent, the new user's account is put in an "unconfirmed" state
until they confirm they are using a legitimate email address (by clicking the link in
the account verification message.)`,


  inputs: {

    fullName: {
      required: true,
      type: 'string',
      example: 'Frida Kahlo de Rivera',
      description: 'The user\'s full name.',
    },

    emailAddress: {
      required: true,
      type: 'string',
      isEmail: true,
      description: 'The email address for the new account, e.g. m@example.com.',
      extendedDescription: 'Must be a valid email address.',
    },

    phoneNumber: {
      required: true,
      type: 'string',
      description: 'The phone numner for the new account, e.g. +251112758622.',
      extendedDescription: 'Must be a valid phone number.',
    },

    position:  {
      required: true,
      type: 'string',
      example: 'Surveillance Officer',
      description: 'The role of the user in the surveillance system.',
    },

    password: {
      required: true,
      type: 'string',
      maxLength: 200,
      example: 'passwordlol',
      description: 'The unencrypted password to use for the new account.'
    },

    admin0administrator: {
      type: 'boolean',
      description: 'Federal administrator',
      example: false
    },

    admin1pcode: {
      type: 'string',
      description: 'Region Name',
      example: 'Somali'
    },

    admin1name: {
      type: 'string',
      description: 'Region Pcode',
      example: 'ET05'
    },

    admin1administrator: {
      type: 'boolean',
      description: 'Region administrator',
      example: false
    },

    admin2pcode: {
      type: 'string',
      description: 'Zone Name',
      example: 'Jaffar'
    },

    admin2name: {
      type: 'string',
      description: 'Zone Pcode',
      example: 'ET0503'
    },

    admin2administrator: {
      type: 'boolean',
      description: 'Zonal administrator',
      example: true
    },

    admin3pcode: {
      type: 'string',
      description: 'Woreda Name',
      example: 'Ararso'
    },

    admin3name: {
      type: 'string',
      description: 'Woreda Pcode',
      example: 'ET050395'
    },

    admin3administrator: {
      type: 'boolean',
      description: 'Woreda administrator',
      example: true
    },

  },


  exits: {

    success: {
      description: 'New user account was created successfully.'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The provided fullName, password and/or email address are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
      'parameters should have been validated/coerced _before_ they were sent.'
    },

    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },

  },


  fn: async function (inputs) {

    // new email address
    var newEmailAddress = inputs.emailAddress.toLowerCase();

    // set notificaiton params (before creating the new user account)
    if (sails.config.custom.verifyEmailAddresses) {

      // emails
      var emails = '';
      var fullName = false;
      var moment = require('moment');
      var url = require('url');

      // woreda
      if(inputs.admin3administrator) {
        var zonalAdmins = await User.find({ emailStatus: 'confirmed', admin2pcode: inputs.admin2pcode, admin2administrator: true });
        zonalAdmins.forEach(function(d){
          emails += d.emailAddress + ',';
          if (!fullName) {
            fullName = d.fullName;
          }
        });
      }
      // zonal
      if(inputs.admin2administrator || inputs.admin3administrator) {
        var regionalAdmins = await User.find({ emailStatus: 'confirmed', admin1pcode: inputs.admin1pcode, admin1administrator: true });
        regionalAdmins.forEach(function(d){
          emails += d.emailAddress + ',';
          if (!fullName) {
            fullName = d.fullName;
          }
        });
      }
      // regional
      if(inputs.admin1administrator || inputs.admin2administrator || inputs.admin3administrator) {
        var federalAdmins = await User.find({ emailStatus: 'confirmed', admin0administrator: true });
        federalAdmins.forEach(function(d){
          emails += d.emailAddress + ',';
          if (!fullName) {
            fullName = d.fullName;
          }
        });
      }

      // find super users by default
      var superAdmins = await User.find({ isSuperAdmin: true });
      superAdmins.forEach(function(d){
        emails += d.emailAddress + ',';
        if (!fullName) {
          fullName = d.fullName;
        }
      });
      // remove last comma
      emails = emails.slice( 0, -1 );

    }

    // Build up data for the new user record and save it to the database.
    // (Also use `fetch` to retrieve the new ID so that we can use it below.)
    var newUserRecord = await User.create(_.extend({
      fullName: inputs.fullName,
      emailAddress: newEmailAddress,
      phoneNumber: inputs.phoneNumber,
      position: inputs.position,
      password: await sails.helpers.passwords.hashPassword(inputs.password),
      admin0administrator: inputs.admin0administrator,
      admin1pcode: inputs.admin1pcode,
      admin1name: inputs.admin1name,
      admin1administrator: inputs.admin1administrator,
      admin2pcode: inputs.admin2pcode,
      admin2name: inputs.admin2name,
      admin2administrator: inputs.admin2administrator,
      admin3pcode: inputs.admin3pcode,
      admin3name: inputs.admin3name,
      admin3administrator: inputs.admin3administrator,
      tosAcceptedByIp: this.req.ip
    }, sails.config.custom.verifyEmailAddresses? {
      emailProofToken: await sails.helpers.strings.random('url-friendly'),
      emailProofTokenExpiresAt: Date.now() + sails.config.custom.emailProofTokenTTL,
      emailStatus: 'unconfirmed'
    }:{}))
    .intercept('E_UNIQUE', 'emailAlreadyInUse')
    .intercept({name: 'UsageError'}, 'invalid')
    .fetch();

    // Store the user's new id in their session.
    this.req.session.userId = newUserRecord.id;

    // send notificaiton of new user account registrstion for full chain of reporting
    if (sails.config.custom.verifyEmailAddresses) {

      // send email
      sails.hooks.email.send( 'email-verify-account', {
        fullName: fullName,
        newUserfullName: newUserRecord.fullName,
        newUserphoneNumber: newUserRecord.phoneNumber,
        newUseremailAddress: newUserRecord.emailAddress,
        newUserposition: newUserRecord.position,
        newUseradmin1name: newUserRecord.admin1name,
        newUseradmin2name: newUserRecord.admin2name,
        newUseradmin3name: newUserRecord.admi3name,
        confirmUrl: url.resolve(sails.config.custom.baseUrl,'/email/confirm') + '?token=' + encodeURIComponent(newUserRecord.emailProofToken),
      },{
        to: emails,
        subject: 'Please confirm new account of ' + newUserRecord.fullName + ' - Registrstion ' + moment().format('LLL'),
      }, function(err) {
        // return
        if ( err ) return 'error';
        // return
        return;
      });

    } else {
      sails.log.info('Skipping new account email verification... (since `verifyEmailAddresses` is disabled)');
    }

  }

};
