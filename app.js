require("dotenv").config();
const server = require("./Server");
const Router = require("./router/Router");
const {initControllers, connectToDB, initServices} = require("./utility/init");
const EmployeeController = require("./Controllers/EmployeeController");
const MyController = require("./Controllers/MyController");
const EmployeeRepository = require("./Repositories/EmployeeRepository");
const ParentRepository = require("./Repositories/ParentRepository");
const EmployeeSrv = require('./services/employeeSrv')
const TodoService = require('./services/TodoService')

async function app() {
    const routes = initControllers([
        {
            controller: EmployeeController,
            handlers: ["addEmployee", "getEmployeeInfoById", "updateEmployeeInfo"],
        },
        {controller: MyController, handlers: ["firstMethod"]},
    ]);

    const servicesInstances = initServices([{employeeSrv: EmployeeSrv, singleton: true}, {
        todoSrv: TodoService,
        singleton: true
    }], routes)

    const empRedis = await connectToDB(6379, 0);
    const parRedis = await connectToDB(6379, 1);
    EmployeeRepository.getInstance(empRedis);
    ParentRepository.getInstance(parRedis);
    new Router(routes, servicesInstances);
    server.start();
    server.listen(81);
}

app();
