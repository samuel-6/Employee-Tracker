// Import dependencies

// Inquirer for user input
const inquirer = require('insquirer');
// Establishes a connection to the db
const connection = require('./db/connection');
// Console.table for tabluar data
require('console.table');

// Main app
const mainMenu = () => {

    // Welcome message
    console.log('Welcome to Employee Manager');

    // Asks the user for input
    inquirer.prompt({

        name: 'start',
        type: 'list',
        message: 'What would you like to do?',
        choices: [

            'View All Employees',
            'View Employees By Department',
            'View Employees By Manager',
            'Add Employee',
            'Remove Employee',
            'Update Employee Role',
            'Update Employee Manager',
            'View All Roles',
            'Add Role',
            'Remove Role',
            'View All Departments',
            'Add Department',
            'Remove Department',
            'View Total Utilized Budget By Department',
            'Quit',

        ],

    })

    // Do something with the answer, in this case a switch statement which will execute a function based on the user answer
    inquirer.then((answer) => {

        switch(answer.start) {

            case 'View All Employees':
                viewAllEmployees();
                break;

            case 'View Employees By Department':
                viewEmployeesByDepartment();
                break;

            case 'View Employees By Manager':
                viewEmployeesByManager();
                break;

            case 'Add Employee':
                addEmployee();
                break;

            case 'Remove Employee':
                removeEmployee();
                break;

            case 'Update Employee Role':
                updateEmployeeRole();
                break;

            case 'Update Employee Manager':
                updateEmployeeManager();
                break;

            case 'View All Roles':
                viewAllRoles();
                break;

            case 'Add Role':
                addRole();
                break;

            case 'Remove Role':
                removeRole();
                break;

            case 'View All Departments':
                viewAllDepartments();
                break;

            case 'Add Department':
                addDepartment();
                break;

            case 'Remove Department':
                removeDepartment();
                break;

            case 'View Total Utilized Budget By Department':
                viewTotalUtilizedBudgetByDepartment();
                break;

            case 'Quit':
                quit();
                break;

        }

    });

};

// View All Employees
function viewAllEmployees() {

    const query = `SELECT
    employee.id,
    employee.first_name,
    employee.last_name,
    role.title,
    department.name AS
    department,
    role.salary,
    CONCAT(manager.first_name, ' ', manager.last_name) AS
    manager FROM
    employee
    LEFT JOIN role ON
    employee.role_id = role.id
    LEFT JOIN department ON
    role.department_id = department.id
    LEFT JOIN employee manager ON
    manager.id = employee.manager_id;`;

    // Logs table in the terminal using console.table
    connection.query(query, (err, data) => {

        if(err) throw err;
        console.table(data);
        mainMenu();

    });
    
}

// View Employees By Department
function viewEmployeesByDepartment() {

    inquirer.prompt({

        name: 'department',
        type: 'list',
        message: 'Please select a department: ',
        choices: [

            'Human Resources',
            'Finance & Accounting',
            'Sales & Marketing',
            'Operations',
            'Information Technology',

        ],

    })

    inquirer.then((answer) => {

        switch(answer.department) {

            case 'Human Resources':
                return vEBDP('Human Resources');

            case 'Finance & Accounting':
                return vEBDP('Finance & Accounting');

            case 'Sales & Marketing':
                return vEBDP('Sales & Marketing');

            case 'Operations':
                return vEBDP('Operations');

            case 'Information Technology':
                return vEBDP('Information Technology');

        }

    });

    function vEBDP(department) {

        const query = `
        SELECT employee.id, 
        employee.first_name, 
        employee.last_name, 
        role.title, 
        department.name AS department 
        FROM employee 
        LEFT JOIN role ON employee.role_id = role.id 
        LEFT JOIN department ON role.department_id = department.id 
        WHERE department.name = ?;`;

        connection.query(query, department, (err, data) => {

            if(err) throw err;
            console.table(data);
            mainMenu();

        });

    }

}

// View Employees By Manager
function viewEmployeesByManager() {

    const query = `SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title, 
    department.name AS 
    department, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id 
    LEFT JOIN employee manager ON manager.id = employee.manager_id 
    ORDER BY manager;`;

    connection.query(query, (err, data) => {

        if(err) throw err;
        console.table(data);
        mainMenu();

    });

}

// Add Employee
function addEmployee() {

    let userInput;

    const query = `SELECT id, title FROM role WHERE title NOT LIKE '%Manager%';`;

    Promise.resolve().then(() => {

        return new Promise((resolve, reject) => {

            connection.query(query, (err, data) => {

                if(err) reject(err);
                else resolve(data);

            });

        });

    })
    .then(() => {

        return new Promise((resolve, reject) => {

            connection.query(query, (err, data) => {

                if(err) reject(err);
                else resolve(data);

            });

        });

    })
    .then((rolesData) => {

        const roles = rolesData.map((item) => `Role title: ${item.title}, Role ID: ${item.id}`);

        return inquirer.prompt([
            
            
            {

                name: 'first_name',
                type: 'input',
                message: 'Please type the new employees first name',

            },
            {

                name: 'last_name',
                type: 'input',
                message: 'Please type the new employees last name',

            },
            {

                name: 'role',
                type: 'list',
                message: 'Please type the new employees id',
                choices: 'roles',

            },
        
        ]);

    })
    .then((answer) => {

        userInput = answer;
        const query2 = `SELECT 
        manager.id as manager_id,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN employee AS manager ON manager.id = employee.manager_id 
        WHERE manager.id IS NOT NULL
        GROUP BY manager_id;`;

        return new Promise((resolve, reject) => {

            connection.query(query2, (err, data) => {

                if(err) reject(err);
                else resolve(data);

            });

        });

    })
    .then((managersData) => {

        const managers = managersData.map((item) => `${item.manager_name} ID:${item.manager_id}`);

        return inquirer.prompt([

            {

                name: 'manager',
                type: 'list',
                message: 'Please select new employees manager',
                choices: [...managers,'None'],

            },

        ]);

    })
    .then((answer) => {

        const query = `INSERT INTO employee 
        (first_name, last_name, role_id, manager_id) 
        VALUES (?, ?, ?, ?)`;

        connection.query(

            query,
            [

                userInput.first_name,
                userInput.last_name,
                userInput.role.split('ID:')[1],
                answer.manager.split('ID:')[1],

            ],
            (err, data) => {

                if(err) throw err;
                console.log(`Added ${userInput.first_name} ${userInput.last_name} to the db`);
                viewAllEmployees();

            }

        );

    });

}