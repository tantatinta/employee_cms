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

            break;
            // case "Add roles":

            // break;
            // case "Add employees":

            // break;
            // case "View departments":

            // break;
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

const exit = () =>{
    connection.end();
}