var async = require('async'),
		Base = require('basejs'),
    DBUser = require('./service/user'),
    DBProduct = require('./service/dashboard-product');

var servicesClasses = {
	dbUser: DBUser,
  dbProduct: DBProduct
};

/**
 * @class
 */
var DatabaseManager = Base.extend({

  constructor: function(app, opts) {
    this.container = {};
    this.app = app;
    this.opts = opts;
    return this;
  },

  /**
   * Initial service instances
   */
  init: function (neededServices, fn) {
    var container = this.container,
        app = this.app,
        self = this;

    async.each(neededServices, function (neededService, done) {
      var service = container[neededService] = new servicesClasses[neededService](app);
      service.init(done);
    }, function (error) {
      if (error) {
        console.log(error);
        self.log('Database service init fail', error);
      } else {
        self.log('Database service init success');
      }
      
      fn(error);
    });
  },

  /**
   * Destroy server
   */
  destroy: function () {
    _.each(this.container, function (instance) {
      instance.terminal();
    });
  },

  /**
   * Get instance of service by name
   */
  getInstance: function (name) {
    return this.container[name];
  },

  log: function (str) {
  	console.log(str);
  }

}, servicesClasses);

/**
 * Expose
 */
module.exports = DatabaseManager;