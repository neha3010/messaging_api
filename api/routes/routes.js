'use strict';

// Create App function
module.exports = function (app) {

	var controller = require('../controllers/controllers');

	// inbound
	app
	  .route("/inbound/sms")
	  .post(controller.inboundSMS)
	  .get(controller.wrongApiMethods)
	  .put(controller.wrongApiMethods)
	  .delete(controller.wrongApiMethods);


	//outbound
	app
	  .route("/outbound/sms")
	  .post(controller.outboundSMS)
	  .get(controller.wrongApiMethods)
	  .put(controller.wrongApiMethods)
	  .delete(controller.wrongApiMethods);
};
