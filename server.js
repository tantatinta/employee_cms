var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,  
  user: "root",  
  password: "root",
  database: "employee_db"
});

const start = () => {
  connection.connect(function(err) {
  if (err) throw err;
    chooseAction();
 
});
}

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
            // case "Add employees":

            // break;
            case "View departments":
                viewDepartments();
            break;
            case "view roles":
                viewRoles();
            break;
            // case "view employees":

            // break;
            // case "Update employee roles":

            // break;
            default:
                exit();

        }
    })
};

start();

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
                console.log("Your department " + answer.name + " has been added.")
                chooseAction();
            }
        )
    })
}

const viewDepartments = () => {
    connection.query(
        "SELECT * FROM departments", (err, res) => {
            if (err) return console.log(err);
            console.table(res);
            chooseAction();
        }
    )
}

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
                return {name: department.name, value: department.id}
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
                console.log("Your role " + answer.title + " has been added.")
                chooseAction();
            }
        );
        console.log(answer)
    });
  });
}

const viewRoles = () => {
    connection.query(
        "SELECT * FROM roles", (err, res) => {
            if (err) return console.log(err);
            console.table(res);
            chooseAction();
        }
    )
}

const exit = () =>{
    connection.end();
}