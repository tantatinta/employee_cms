var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "employee_db"
});



const start = () => {
    connection.connect(function (err) {
        if (err) throw err;
        chooseAction();

    });
};

const chooseAction = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What do you want to do?",
            choices: ["Add departments", "Add roles", "Add employees", "View departments", "view roles", "view employees", "Update employee roles", "Exit"]
        }
    ]).then((answer) => {
        switch (answer.action) {
            case "Add departments":
                addDepartment();
                break;
            case "Add roles":
                addRole();
                break;
            case "Add employees":
                addEmployee();
                break;
            case "View departments":
                viewDepartments();
                break;
            case "view roles":
                viewRoles();
                break;
            case "view employees":
                viewEmployees();
            break;
            case "Update employee roles":
                updateEmployeeRoles();
            break;
            default:
                exit();

        }
    })
};

const updateEmployeeRoles = () => {
    connection.query("SELECT * FROM employees", function (err, results) {
        if (err) console.log(err)
        const employeeArr = results.map(( {id, last_name, first_name}) => {
            return {name: `${last_name}, ${first_name}`, value: id}
        })
        connection.query("SELECT * FROM roles", (err, rolesRes) => {
            if (err) console.log(err)
            const rolesArr = rolesRes.map( ({ id, title }) =>( {value: id, name: title}))
                inquirer.prompt([
                    {
                        type: "list",
                        name: "id",
                        message: "What is the name of the employee whose name you want to update?",
                        choices: employeeArr
                    },
                    {
                        type: "list",
                        name: "roleId",
                        message: "What is the new role for this employee",
                        choices: rolesArr
                    }
                ]).then((answers) => {
                    connection.query("UPDATE employees SET role_id = ? WHERE id = ?",
                    [
                        answers.roleId,
                        answers.id
                    ],

                    (err, res) => {
                        if (err) console.log(err);
                    
                        chooseAction();
                        }
                    )
                });
            })
        
        
        
        });
};


const addEmployee = () => {
    connection.query("SELECT * FROM roles", (err, rolesRes) => {
        if (err) console.log(err)
        connection.query("SELECT * FROM employees", (err, employeesRes) => {
            
            if (err) console.log(err)

            let listEmp = employeesRes.map((employee) => {
                return { 
                    name: `${employee.first_name} ${employee.last_name}`, value: employee.id 
                }
            })
            listEmp.push({ name: "None", value: null })
            
            inquirer.prompt([
                {
                    type: "input",
                    name: "first_name",
                    message: "What is your employee's first name?"
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "What is your employee's last name?"
                },
                {
                    type: "rawlist",
                    name: "role_id",
                    message: "What role does this employee have?",
                    choices: rolesRes.map((role) => {
                        return { name: role.title, value: role.id }
                    })
                },
                {
                    type: "list",
                    name: "manager_id",
                    message: "Does this employee have a manager?",
                    choices: listEmp
                },
            ]).then((answer) => {
                connection.query("INSERT INTO employees SET ?",
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.role_id,
                    manager_id: answer.manager_id
                }, (err, res) => {
                    if (err) return console.log(err);
                    console.log(`Your employee ${answer.first_name} ${answer.last_name} has been added.`)
                    chooseAction();
                }
                )
            });
        });

    });
};

const viewEmployees = () => {
    connection.query(
        "SELECT employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT (manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees manager ON manager.id = employees.manager_id", (err, res) => {
            if (err) return console.log(err);
            console.table(res);
            chooseAction();
        }
    )
};

const addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the department that you want to add?"
        }
    ]).then((answer) => {
        connection.query(
            "INSERT INTO departments SET ?",
            {
                name: answer.name
            }, (err, res) => {
                if (err) return console.log(err);
                console.log(`Your department ${answer.name} has been added.`)
                chooseAction();
            }
        )
    })
};

const viewDepartments = () => {
    connection.query(
        "SELECT departments.name AS department FROM departments", (err, res) => {
            if (err) return console.log(err);
            console.table(res);
            chooseAction();
        }
    )
};

const addRole = () => {
    connection.query("SELECT * FROM departments", (err, res) => {
        if (err) console.log(err)

        inquirer.prompt([
            {
                type: "input",
                name: "title",
                message: "What is the title of the role that you want to add?"
            },
            {
                type: "input",
                name: "salary",
                message: "What is the salary for that role?"
            },
            {
                type: "rawlist",
                name: "department_id",
                message: "What department does this role belong to?",
                choices: res.map((department) => {
                    return { name: department.name, value: department.id }
                })
            }
        ]).then((answer) => {
            connection.query(
                "INSERT INTO roles SET ?",
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.department_id
                }, (err, res) => {
                    if (err) return console.log(err);
                    console.log(`Your role ${answer.title} has been added.`)
                    chooseAction();
                }
            );
            console.log(answer)
        });
    });
};

const viewRoles = () => {
    connection.query(
        "SELECT roles.title, roles.salary, departments.name AS department FROM roles INNER JOIN departments ON roles.department_id = departments.id", (err, res) => {
            if (err) return console.log(err);
            console.table(res);
            chooseAction();
        }
    )
};

const exit = () => {
    connection.end();
};

start();