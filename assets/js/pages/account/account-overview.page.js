parasails.registerPage('account-overview', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {

    me: { /* ... */ },

    isBillingEnabled: false,

    hasBillingCard: false,

    // Syncing/loading states for this page.
    syncingUpdateCard: false,
    syncingRemoveCard: false,

    // Form data
    formData: { /* … */ },

    // Server error state for the form
    cloudError: '',

    // For the Stripe checkout window
    checkoutHandler: undefined,

    // For the confirmation modal:
    removeCardModalVisible: false,
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function (){
    _.extend(this, window.SAILS_LOCALS);
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

  }
});
