require("reflect-metadata");

function controller(prefix) {
  return (target) => {
    Reflect.defineMetadata("prefix", prefix, target);
  };
}

function method(method) {
  return (target, key, desc) => {
    Reflect.defineMetadata("method", method, target, key);
  };
}

function path(path) {
  return (target, key, desc) => {
    Reflect.defineMetadata("path", path, target, key);
  };
}

function injectDependency(depName){
  return (target) => {
    Reflect.defineMetadata("dependency", depName, target);
  };
}

module.exports = {
  controller,
  method,
  path,
  injectDependency
};
