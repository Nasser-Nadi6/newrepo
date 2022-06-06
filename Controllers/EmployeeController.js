const BaseController = require("./Base-Controller/BaseController");
const { controller, method, path, injectDependency} = require("../decorators/decorators");

const { sendResponse, userExist } = require("../utility/utility");
const PaginationHelper = require("../utility/PaginationHelper");

@injectDependency('employeeSrv')
@controller("/dataService")
class EmployeeController extends BaseController {
  static instance;
  employeeSrv

  constructor(services) {
    super();
    this.employeeSrv=services[0]
  }

  @method("POST")
  @path("/add")
  async addEmployee(req, res) {
    try {
      const { id, data, parentId } = req.payload;
      if (!parentId) {
        return sendResponse(res, 400, { error: "parentId does not exist" });
      }

      const employee = await this.employeeSrv.add(id, data, parentId);
      if (userExist(employee)) {
        return sendResponse(res, 400, {
          message: "employee id is already exist.",
        });
      }

      return sendResponse(res, 201, { message: "Data stored successfully." });
    } catch (error) {
      sendResponse(res, 500, {
        error: "something went wrong.please try again later.",
      });
    }
  }

  @method("GET")
  @path("/get")
  async getEmployeeInfoById(req, res) {
    try {
      const id = req.query.id;
      if (!id) {
        return sendResponse(res, 400, { error: "Invalid id" });
      }
      const result = await this.employeeSrv.get(id);
      if (!result.data || !result.parentId) {
        return sendResponse(res, 404, {
          message: "user with this id not found",
        });
      }
      sendResponse(res, 200, result);
    } catch (error) {
      sendResponse(res, 500, {
        error: "something went wrong.please try again later.",
      });
    }
  }

  @method("PUT")
  @path("/update")
  async updateEmployeeInfo(req, res) {
    try {
      const { id, data, parentId } = req.payload;
      // id and parentId are required
      if (!parentId || !id) {
        return sendResponse(res, 400, {
          error: "parentId or id does not exist",
        });
      }

      // check if user with this id is exist
      const employee = await this.employeeSrv.get(id);

      // console.log(Object.keys(employee.data).length === 0);
      if (!userExist(employee.data)) {
        return sendResponse(res, 404, {
          error: "user with this id is not exist",
        });
      }

      // check if data's properties is valid
      const dataKeys = Object.keys(employee.data);
      const newDataKeys = Object.keys(data);

      const validDataFlag = newDataKeys.every((el) => {
        return dataKeys.includes(el);
      });

      //if user exist and data's properties are valid, we update user info
      if (validDataFlag) {
        await this.employeeSrv.update(id, data, parentId);
        sendResponse(res, 200, {
          message: "Information updated successfully.",
        });
      } else {
        sendResponse(res, 400, { error: "Invalid request data." });
      }
    } catch (error) {
      sendResponse(res, 500, {
        error: "something went wrong.please try again later.",
      });
    }
  }

  static getInstance(services) {
    if (this.instance) {
      return this.instance;
    }

    return (this.instance = new EmployeeController(services));
  }
}

module.exports = EmployeeController;
