var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('lodash');
var modalTemplate = require('./templates/modal.handlebars');
var bodyTemplate = require('./templates/body.handlebars');
var headerTemplate = require('./templates/header.handlebars');
var footerWrapperTemplate = require('./templates/footer-wrapper.handlebars');
Backbone.$ = $;
// require('bootstrap');

module.exports = Backbone.View.extend({
  /**
   * footer html
   * @type {DOM/Function}
   */
  footer: null,
  /**
   * header html
   * @type {DOM/Function}
   */
  header: null,
  /**
   * content html
   * @type {DOM/Function}
   */
  content: null,
  /**
   * body html
   * @type {DOM/Function}
   */
  body: null,
  /**
   * Function that executes on modal show
   * @type {function}
   */
  onShow: null,
  /**
   * Function that executes on modal hide
   * @type {function}
   */
  onHide: null,

  /**
   * whether the modal is able to be dismissed
   * @type {Boolean}
   */
  dismissable: true,
  /**
   * when using the confirm or alert modals, setting the title appropriately
   * @type {[type]}
   */
  title: null,
  yesLabel: 'Yes',
  /**
   * what occurs when the user clicks no
   * @type {function}
   * @returns {boolean} if false the hide function won't execute
   */
  onNo: null,
  noLabel: 'No',

  /**
  * what occurs when the user clicks yes/ok
  * @type {function}
  * @returns {boolean} if false the hide function won't execute
  */
  onYes: null,

  events: {
    'click .yes-button': 'yesButton',
    'click .no-button': 'noButton'
  },
  closeModal: function(callback) {
    this.$el.find('.modal').modal('hide');
    if (_.isFunction(callback)) {
      return callback();
    }
  },
  yesButton: function() {
    var self = this;

    // If onYes is not a function, then close modal if true
    if (!_.isFunction(this.onYes)) {
      if (this.onYes === true) {
        self.$el.find('.modal').modal('hide');
      }
      return;
    }
    // If onYes is a function, then call it and close modal if truthy
    if (this.onYes.length === 1) {
      // If onYes has been defined with an arity of 1, then feed it a callback
      this.onYes(function(closeModal) {
        if (closeModal === true) {
          self.$el.find('.modal').modal('hide');
        }
      });
    } else if (this.onYes.length === 0) {
      // If onYes has been defined with an arity of 0, then call it
      if (this.onYes() === true) {
        self.$el.find('.modal').modal('hide');
      }
    }
  },

  /**
   * what occurs when the user clicks no/cancel
   * @return {boolean} if false, then the hide function won't execute
   */
  noButton: function() {
    var self = this;

    // If onNo is not a function, then close modal if true
    if (!_.isFunction(this.onNo)) {
      if (this.onNo === true) {
        this.$el.find('.modal').modal('hide');
      }
      return;
    }

    // If onNo is a function, then call it and close modal if true
    if (this.onNo.length === 1) {
      // If onNo has been defined with an arity of 1, then feed it a callback
      this.onNo(function(closeModal) {
        if (closeModal === true) {
          self.$el.find('.modal').modal('hide');
        }
      });
    } else if (this.onNo.length === 0) {
      // If onNo has been defined with an arity of 0, then call it
      if (this.onNo() === true) {
        this.$el.find('.modal').modal('hide');
      }
    }
  },
  render: function() {
    var options = {};
    var self = this;
    var header = this.header;
    var footer = this.footer;

    this.$el.html(modalTemplate());
    //replace all the content of the modal
    if (this.content) {
      this.$el.find('.modal-content').html(this.content);
    } else {
      //for closure scenarios
      if (_.isFunction(this.header)) {
        header = this.header();
      } else if (this.header === null) {
        header = headerTemplate({
          title: this.title,
          dismissable: this.dismissable
        });
      } else {
        header = '<div class="modal-header">' + this.header + '</div>';
      }
      //for closure scenarios
      if (_.isFunction(this.footer)) {
        footer = this.footer();
      }

      //append the header - this is driven by the configuration
      this.$el.find('.modal-content').append(header);
      //append the body wrapper
      this.$el.find('.modal-content').append(bodyTemplate());
      //append the body - this is driven by the configuration
      this.$el.find('.modal-body').append(this.body);
      //append the footer wrapper
      if (footer !== null) {
        this.$el.find('.modal-content').append(footerWrapperTemplate());
        //append the footer - this is driven by the configuration
        this.$el.find('.modal-footer').append(footer);
      }
    }

    if (this.dismissable === false) {
      options = {
        "backdrop": "static",
        "keyboard": false
      };
    }
    //apply the options and treat the modal as a modal
    this.$el.find('.modal').modal(options);

    // run the on show function
    if (this.onShow) {
      this.onShow();
    }
    // if its hidden run the on hide function and remove the view
    this.$el.find('.modal').on('hidden.bs.modal', function() {
      if (self.onHide) {
        self.onHide();
      }
      self.remove();
    });
    // show the modal
    this.$el.find('.modal').modal('show');
    return this;
  }
});