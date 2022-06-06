const {
  sendResponse,
  validPaths,
  checkRoute,
  routeIsValid,
} = require("../utility/utility");

class BaseHandler {
  #nextHandler;

  handle(request, response, routes,servicesInstances) {
    if (this.#nextHandler) {
      return this.#nextHandler.handle(request, response, routes,servicesInstances);
    } else {
      const validRoutesAndMethods = validPaths(request.pathName, routes);
      const incomingRequestUrlandMethod = checkRoute(request);
      const validRoute = routeIsValid(
        validRoutesAndMethods,
        incomingRequestUrlandMethod
      );
      if (validRoute) {
         validRoute.controller.controller.getInstance(servicesInstances)[validRoute.handler](
          request,
          response
        );
      } else {
        sendResponse(response, 404, { message: "Resource not found." });
      }
    }
  }

  setNext(handler) {
    this.#nextHandler = handler;
    return handler;
  }
}

module.exports = BaseHandler;
