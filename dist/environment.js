"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Environments;
(function (Environments) {
    Environments["dev_environment"] = "dev";
    Environments["prod_environment"] = "prod";
})(Environments || (Environments = {}));
class Environment {
    constructor(environment) {
        this.environment = environment;
    }
    getPort() {
        if (this.environment === Environments.dev_environment) {
            return 3002;
        }
        else if (this.environment === Environments.prod_environment) {
            return 3001;
        }
        else {
            return 3000;
        }
    }
    getDBName() {
        if (this.environment === Environments.prod_environment) {
            return 'db_test_project_prod';
        }
        else if (this.environment === Environments.dev_environment) {
            return 'db_test_project_dev';
        }
        else {
            return 'db_test_project_local';
        }
    }
}
exports.default = new Environment(Environments.dev_environment);
