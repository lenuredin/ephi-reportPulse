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

    var newEmailAddress = inputs.emailAddress.toLowerCase();

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

    // If billing feaures are enabled, save a new customer entry in the Stripe API.
    // Then persist the Stripe customer id in the database.
    if (sails.config.custom.enableBillingFeatures) {
      let stripeCustomerId = await sails.helpers.stripe.saveBillingInfo.with({
        emailAddress: newEmailAddress
      }).timeout(5000).retry();
      await User.updateOne(newUserRecord.id)
      .set({
        stripeCustomerId
      });
    }

    // Store the user's new id in their session.
    this.req.session.userId = newUserRecord.id;

    if (sails.config.custom.verifyEmailAddresses) {
      // Send "confirm account" email
      // await sails.helpers.sendTemplateEmail.with({
      //   to: newEmailAddress,
      //   subject: 'Please confirm your account',
      //   template: 'email-verify-account',
      //   templateData: {
      //     fullName: inputs.fullName,
      //     token: newUserRecord.emailProofToken
      //   }
      // });
      sails.log.info('ToDo: Send email address');
    } else {
      sails.log.info('Skipping new account email verification... (since `verifyEmailAddresses` is disabled)');
    }

  }

};
