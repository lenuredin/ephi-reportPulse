parasails.registerPage('signup', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {

    // Form data
    formData: { /* … */ },

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */ },

    // Syncing / loading state
    syncing: false,

    // Server error state
    cloudError: '',

    // Success state when form has been submitted
    cloudSuccess: false,

  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
    // set admin for forms
    this.admin2ListFilter = this.admin2List;
    this.admin3ListFilter = this.admin3List;
  },
  mounted: function() {
    // autofocus on first input
    this.$focus('[autofocus]');
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    submittedForm: function() {

      if(this.isEmailVerificationRequired) {
        // If email confirmation is enabled, show the success message.
        this.cloudSuccess = true;
      }
      else {
        // Otherwise, redirect to the logged-in dashboard.
        // > (Note that we re-enable the syncing state here.  This is on purpose--
        // > to make sure the spinner stays there until the page navigation finishes.)
        this.syncing = true;
        window.location = '/';
      }
    },

    // position updated
    positionChange: function() {
      // clear admin1
      delete this.formData.admin1pcode;
      delete this.formData.admin1name;
      // clear admin2
      delete this.formData.admin2pcode;
      delete this.formData.admin2name;
      this.admin2ListFilter = [];
      // clear admin3
      delete this.formData.admin3pcode;
      delete this.formData.admin3name;
      this.admin3ListFilter = [];
      // force state refresh
      this.$forceUpdate();
    },

    // filter admin lists on select
    adminChange: function( level ) {

      var argins = this.formData;

      // admin1
      if ( level === 'admin1' ) {

        // clear admin2
        delete this.formData.admin2pcode;
        delete this.formData.admin2name;

        // clear admin3
        delete this.formData.admin3pcode;
        delete this.formData.admin3name;
        this.admin3ListFilter = [];

        // filter admin2
        this.admin2ListFilter = _.filter(this.admin2List, function(item) {
          return argins.admin1pcode === item.admin1pcode;
        });
      }

      // admin2
      if ( level === 'admin2' ) {

        // clear admin2
        delete this.formData.admin3pcode;
        delete this.formData.admin3name;

        // filter admin3
        this.admin3ListFilter = _.filter(this.admin3List, function(item) {
          return argins.admin2pcode === item.admin2pcode;
        });
      }

      // force state refresh
      this.$forceUpdate();
    },

    handleParsingForm: function() {

      // Clear out any pre-existing error messages.
      this.formErrors = {};

      var argins = this.formData;

      // Validate full name:
      if(!argins.fullName) {
        this.formErrors.fullName = true;
      }

      // Validate full name:
      if(!argins.phoneNumber) {
        this.formErrors.phoneNumber = true;
      }

      // Validate email:
      var isValidEmailAddress = parasails.require('isValidEmailAddress');
      if(!argins.emailAddress || !isValidEmailAddress(argins.emailAddress)) {
        this.formErrors.emailAddress = true;
      }

      // Validate position:
      if(!argins.position) {
        this.formErrors.position = true;
      }

      // Validate password:
      if(!argins.password) {
        this.formErrors.password = true;
      }

      // Validate password confirmation:
      if(argins.password && argins.password !== argins.confirmPassword) {
        this.formErrors.confirmPassword = true;
      }

      // Set admin1name
      if (argins.admin1pcode) {
        var admin1 = _.find(this.admin1List, function(item) {
          return argins.admin1pcode === item.admin1pcode;
        });
        argins.admin1name = admin1.admin1name;
      }

      // Set admin2name
      if (argins.admin2pcode) {
        var admin2 = _.find(this.admin2List, function(item) {
          return argins.admin2pcode === item.admin2pcode;
        });
        argins.admin2name = admin2.admin2name;
      }

      // Set admin3name
      if (argins.admin3pcode) {
        var admin3 = _.find(this.admin3List, function(item) {
          return argins.admin3pcode === item.admin3pcode;
        });
        argins.admin3name = admin3.admin3name;
      }

      // If there were any issues, they've already now been communicated to the user,
      // so simply return undefined.  (This signifies that the submission should be
      // cancelled.)
      if (Object.keys(this.formErrors).length > 0) {
        return;
      }

      return argins;
    }

  }
});
