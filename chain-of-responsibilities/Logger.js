const BaseHandler = require("./BaseHandler");

class Logger extends BaseHandler {
  handle(requset, response, routes,servicesInstances) {
    console.log("logger");
    return super.handle(requset, response, routes,servicesInstances);
  }
}

module.exports = new Logger();
