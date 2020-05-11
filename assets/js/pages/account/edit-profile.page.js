parasails.registerPage('edit-profile', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {

    // Main syncing/loading state for this page.
    syncing: false,

    // Form data
    // formData: { /* … */ },

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */ },

    // Server error state for the form
    cloudError: '',

  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach raw data exposed by the server.
    _.extend(this, SAILS_LOCALS);
    // set admin for forms
    this.admin2ListFilter = this.admin2List;
    this.admin3ListFilter = this.admin3List;

    //
    this.user.emailAddress = this.user.emailChangeCandidate ? this.user.emailChangeCandidate : this.user.emailAddress;
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    // redirect to edit account
    clickCancel: function(userId){
      window.location = '/account/' + userId;
    },

    // for disabled for current user
    isDisabled: function(){

      // disabled
      var disabled = true;

      // set user
      var user = this.user;

      // if this is current users account
      if (this.me.id === user.id) {
        disabled = false;
      }
      // if super admin
      if (this.me.isSuperAdmin) {
        disabled = false;
      }
      // if federal admin
      if (this.me.admin0administrator) {
        disabled = false;
      }
      // if regional admin
      if (this.me.admin1administrator &&
            user.admin1pcode !== 'all' &&
            this.me.admin1pcode === user.admin1pcode) {
        disabled = false;
      }
      // if zonal admin
      if (this.me.admin2administrator &&
            user.admin2pcode !== 'all' &&
            this.me.admin2pcode === user.admin2pcode) {
        disabled = false;
      }
      // if woreda admin
      if (this.me.admin3administrator &&
            user.admin3pcode !== 'all' &&
            this.me.admin3pcode === user.admin3pcode) {
        disabled = false;
      }

      return disabled;
    },

    // position updated
    positionChange: function() {

      // set admin level
      // regional
      if(this.user.position === 'Regional Surveillance Officer') {
        this.user.admin0administrator = false;
      }
      // zonal
      if(this.user.position === 'Zonal Surveillance Officer') {
        this.user.admin0administrator = false;
        this.user.admin1administrator = false;
      }
      // woreda
      if(this.user.position === 'Woreda Surveillance Officer') {
        this.user.admin0administrator = false;
        this.user.admin1administrator = false;
        this.user.admin2administrator = false;
      }

      // clear admin1
      delete this.user.admin1pcode;
      delete this.user.admin1name;
      // clear admin2
      delete this.user.admin2pcode;
      delete this.user.admin2name;
      this.admin2ListFilter = [];
      // clear admin3
      delete this.user.admin3pcode;
      delete this.user.admin3name;
      this.admin3ListFilter = [];
      // force state refresh
      this.$forceUpdate();
    },

    // filter admin lists on select
    adminChange: function( level ) {

      var argins = this.user;

      // admin1
      if ( level === 'admin1' ) {

        // clear admin2
        delete this.user.admin2pcode;
        delete this.user.admin2name;

        // clear admin3
        delete this.user.admin3pcode;
        delete this.user.admin3name;
        this.admin3ListFilter = [];

        // filter admin2
        this.admin2ListFilter = _.filter(this.admin2List, function(item) {
          return argins.admin1pcode === item.admin1pcode;
        });
      }

      // admin2
      if ( level === 'admin2' ) {

        // clear admin2
        delete this.user.admin3pcode;
        delete this.user.admin3name;

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

      var argins = this.user;

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

      // Set admin1name
      if (argins.admin1pcode && argins.admin1pcode !== 'all') {
        var admin1 = _.find(this.admin1List, function(item) {
          return argins.admin1pcode === item.admin1pcode;
        });
        argins.admin1name = admin1.admin1name;
      }

      // Set admin2name
      if (argins.admin2pcode && argins.admin2pcode !== 'all') {
        var admin2 = _.find(this.admin2List, function(item) {
          return argins.admin2pcode === item.admin2pcode;
        });
        argins.admin2name = admin2.admin2name;
      }

      // Set admin3name
      if (argins.admin3pcode && argins.admin3pcode !== 'all') {
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
    },

    submittedForm: function() {

      // Redirect to the account page on success.
      // > (Note that we re-enable the syncing state here.  This is on purpose--
      // > to make sure the spinner stays there until the page navigation finishes.)
      this.syncing = true;
      window.location = '/account/' + this.user.id;

    }

  }
});
