parasails.registerPage('account-overview', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {

    // Main syncing/loading state for this page.
    syncing: false,

    // Server error state for the form
    cloudError: '',

    // verify modal
    confirmVerifyUserModalOpen: false,
    confirmRemoveUserModalOpen: false,

  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function (){
    _.extend(this, window.SAILS_LOCALS);
  },
  mounted: function(){
    // hide alert
    $('#alert-msg').hide();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    // redirect to edit account
    clickEditUser: function(userId){
      window.location = '/account/profile/' + userId;
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

    /* VERIFIY USER */

    // very user
    clickVerifyUser: function(){
      this.confirmVerifyUserModalOpen = true;
    },

    // handle verification
    handleParsingVerifyUserForm: function(){
      this.user.emailStatus = 'confirmed';
      return this.user;
    },

    // on submit
    submittedVerifyUserForm: function() {
      // alert
      $('#alert-msg').fadeTo(6000, 500).slideUp(500, function() {
        $('#alert-msg').slideUp(500);
      });
      // close modal
      this.confirmVerifyUserModalOpen = false;
    },

    /* REMOVE USER */

    // prompt remove user
    clickRemoveUser: function() {
      // Open the modal.
      this.confirmRemoveUserModalOpen = true;
    },

    // handle parsing
    handleParsingRemoveUserForm: function(){
      return {
        user: this.user
      }
    },

    // user submitted
    submittedRemoveUserForm: function(){
      // Show the success message.
      this.cloudSuccess = true;
      // alert
      $('#alert-msg').fadeTo(6000, 500).slideUp(500, function() {
        $('#alert-msg').slideUp(500);
      });
      // close modal
      this.confirmRemoveUserModalOpen = false;
      // redirect
      window.location = '/users';
    },

    /* GENERIC */

    // close modal
    closeUserModal: function(){
      // reset
      this.confirmVerifyUserModalOpen = false;
      this.confirmRemoveUserModalOpen = false;
      this.cloudError = '';
    }


  }
});
