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
            // case "Add roles":

            // break;
            // case "Add employees":

            // break;
            case "View departments":
                viewDepartments();
            break;
            // case "view roles":

            // break;
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

const exit = () =>{
    connection.end();
}