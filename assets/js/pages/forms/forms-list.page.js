parasails.registerPage('forms-list', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {

    // Main syncing/loading state for this page.
    syncing: false,

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `todo`.
    formErrors: { /* … */ },

    // Server error state for the form
    cloudError: '',

    // Success state when form has been submitted
    cloudSuccess: false,

    //
    formSaveLabel: 'Update',
    selectedRecord: undefined,
    editViewRecordModalOpen: false,
    confirmRemoveRecordModalOpen: false

  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
    // set admin filter lists for forms
    this.admin2ListFilter = this.admin2List;
    this.admin3ListFilter = this.admin3List;
    this.adminsitesListFilter = this.adminsitesList;
    // fetch xlsFormChoices
      // see 'assets/js/utilities/xls-form-choices.js'
    var xlsFormChoices = parasails.require('xlsFormChoices');
    this.choices = xlsFormChoices(this.form.form_name);
  },
  mounted: async function() {
    // hide alert
    $('.alert').hide();
    // dataTable tables
    $('#record-list-pending-validation-table').DataTable();
    $('#record-list-validated-table').DataTable();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    // make uuid
    uuididv4: function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

    // filter admin lists on select
    adminChange: function( level ) {

      var argins = this.selectedRecord;

      // admin1
      if ( level === 'admin1' ) {

        // clear admin2
        delete this.selectedRecord.admin2pcode;
        delete this.selectedRecord.admin2name;

        // clear admin3
        delete this.selectedRecord.admin3pcode;
        delete this.selectedRecord.admin3name;
        this.admin3ListFilter = [];

        // filter admin2
        this.admin2ListFilter = _.filter(this.admin2List, function(item) {
          return argins.admin1pcode === item.admin1pcode;
        });
      }

      // admin2
      if ( level === 'admin2' ) {

        // clear admin2
        delete this.selectedRecord.admin3pcode;
        delete this.selectedRecord.admin3name;
        // this.adminsitesListFilter = [];

        // filter admin3
        this.admin3ListFilter = _.filter(this.admin3List, function(item) {
          return argins.admin2pcode === item.admin2pcode;
        });
      }

      // admin3
      if ( level === 'admin3' ) {

        // clear health_facilities
        delete this.selectedRecord.site_id;
        delete this.selectedRecord.site_name;

        // filter admin3
        this.adminsitesListFilter = _.filter(this.adminsitesList, function(item) {
          return argins.admin3pcode === item.admin3pcode;
        });
      }


      // force state refresh
      this.$forceUpdate();

    },

    // add new record
    clickAddButton: function(){
      // button label
      this.formSaveLabel = 'Save';
      // new empty record
      this.selectedRecord = {}
      // Open the modal.
      this.editViewRecordModalOpen = true;
      // add 'large-lg' class
      setTimeout(function(){
        $('.modal-dialog').addClass('modal-lg');
      }, 201);
    },

    // view the record
    clickUpdateRecord: function(recordId) {
      // button label
      this.formSaveLabel = 'Update';
      // set selected
      this.selectedRecord = _.find(this.records, {id: recordId});
      // Open the modal.
      this.editViewRecordModalOpen = true;
      // add 'large-lg' class
      setTimeout(function(){
        $('.modal-dialog').addClass('modal-lg');
      }, 201);
    },

    // handle parsing update
    handleParsingAddUpdateRecordForm: function(){
      // if a new entry, set init sailsjs values required in model
      if ( this.formSaveLabel === 'Save' ) {
        // set uuid
        this.selectedRecord.id = 'uuid:' + this.uuididv4();
        var argins = this.selectedRecord;
        // Set admin1name
        if (argins.admin1pcode) {
          var admin1 = _.find(this.admin1List, function(item) {
            return argins.admin1pcode === item.admin1pcode;
          });
          this.selectedRecord.admin1name = admin1.admin1name;
        }
        // Set admin2name
        if (argins.admin2pcode) {
          var admin2 = _.find(this.admin2List, function(item) {
            return argins.admin2pcode === item.admin2pcode;
          });
          this.selectedRecord.admin2name = admin2.admin2name;
        }
        // Set admin3name
        if (argins.admin3pcode) {
          var admin3 = _.find(this.admin3List, function(item) {
            return argins.admin3pcode === item.admin3pcode;
          });
          this.selectedRecord.admin3name = admin3.admin3name;
        }
        //user, createdAt, updatedAt
        this.selectedRecord.creatorUser = this.me.emailAddress;
        this.selectedRecord.createdAt = new Date();
        this.selectedRecord.updatedAt = new Date();
      }
      // send to server for processing
      return {
        form_name: this.form.form_name,
        record: this.selectedRecord
      }
    },

    // handle submission
    submittedAddUpdateRecordForm: function(){
      // Show the success message.
      this.cloudSuccess = true;
      if ( this.formSaveLabel === 'Save' ) {
        this.selectedRecord.id =
        this.records.push(this.selectedRecord);
        // force state refresh
        // this.$forceUpdate();
      }
      // alert
      $('.alert').fadeTo(6000, 500).slideUp(500, function() {
        $('.alert').slideUp(500);
      });
      // Close the modal.
      this.selectedRecord = undefined;
      this.confirmRemoveRecordModalOpen = false;
    },


    /* REMOVE */

    // prompt to remove record
    clickRemoveRecord: function(recordId) {
      // button label
      this.formSaveLabel = 'Remove';
      // set selected
      this.selectedRecord = _.find(this.records, {id: recordId});
      // Open the modal.
      this.confirmRemoveRecordModalOpen = true;
    },

    // handle parsing remove record
    handleParsingDeleteRecordForm: function(){
      return {
        form_name: this.form.form_name,
        record: this.selectedRecord
      }
    },

    // remove from UI
    submittedDeleteRecordForm: function(){
      // Show the success message.
      this.cloudSuccess = true;
      // Remove the thing from the list
      _.remove(this.records, {id: this.selectedRecord.id});
      // alert
      $('.alert').fadeTo(6000, 500).slideUp(500, function() {
        $('.alert').slideUp(500);
      });
      // Close the modal.
      this.selectedRecord = undefined;
      this.confirmRemoveRecordModalOpen = false;
    },

    // close modal
    closeModalOpen: function(){
      this.selectedRecord = undefined;
      this.editViewRecordModalOpen = false;
      this.confirmRemoveRecordModalOpen = false;
      this.cloudError = '';
    }

  }
});
