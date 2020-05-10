/**
 * <datepicker>
 * -----------------------------------------------------------------------------
 * A wrapper for the jQuery UI datepicker
 *
 * @type {Component}
 *
 * @event input   [emitted when the value changes]
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('datepicker', {

  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: [
    // The v-model
    'value',
    // Flag telling us whether the datepicker should be a popup (if truthy)
    // or always visible (if falsy)
    'popup',
    // date formats
    'dateFormat',
    'databaseFormat',
    // The following are only relevant if using the popup style of datepicker:
    'invalid',
    'validationErrorMessage',
    'placeholderText'
  ],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function (){
    return {
      //...
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
  <div class="datepicker-wrapper">
    <div datepicker-el v-if="!popup"></div>
    <input class="form-control" v-else type="text" :value="value" :class="[invalid ? 'is-invalid' : '']" :placeholder="placeholderText || 'Choose return date'" datepicker-el/>
    <div class="invalid-feedback" v-if="invalid">{{validationErrorMessage}}</div>
  </div>
  `,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  mounted: function (){

    // set format
    // Vue triggers warning if prop manipulated directly, so assigned to a temp variable
    this.dateFormatData = this.dateFormat ? this.dateFormat : 'dd/mm/yy';
    this.databaseFormatData = this.databaseFormat ? this.databaseFormat : 'yy-mm-dd';

    // init
    this.$find('[datepicker-el]').datepicker({
      dateFormat: _this.dateFormatData,
      onSelect: (dateText, datepicker)=> {//eslint-disable-line no-unused-vars
        this.$emit('input', dateText);
      }
    });

  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    doParseDate: function() {
      return $.datepicker.parseDate(this.databaseFormatData, this.value);
    }

  }

});
