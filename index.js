// Import dependencies

// Inquirer for user input
const inquirer = require('inquirer');
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

// Remove Employee
function removeEmployee() {

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
    employee LEFT JOIN role ON 
    employee.role_id = role.id 
    LEFT JOIN department ON 
    role.department_id = department.id LEFT JOIN 
    employee manager ON 
    manager.id = employee.manager_id;`;

    connection.query(query, (err, data) => {

        if(err) throw err;
        const employees = data.map((item) => `${item.first_name} ${item.last_name}`);

        inquirer.prompt({

            name: 'employee',
            type: 'list',
            message: 'Please select the employee to remove: ',
            choices: [...employees],

        })
        .then((answer) => {

            const query = `DELETE FROM employee WHERE first_name = ? AND last_name = ?`;
            
            connection.query(

                query,
                [answer.employee.split(" ")[0], answer.employee.split(" ")[1]],
                (err, data) => {

                    if(err) throw err;
                    console.log(`${answer.employee} removed from the db`);
                    viewAllEmployees();

                }

            );

        });

    });

}

// Update Employee Role
function updateEmployeeRole() {

    const query = `SELECT first_name, last_name FROM employee;`;

    connection.query(query, (err, data) => {

        const employees = data.map((item) => `${item.first_name} ${item.last_name}`);

        inquirer.prompt([

            {

                name: 'employee',
                type: 'list',
                message: 'Please select the employee to update: ',
                choices: employees,

            },

        ])
        .then((answer) => {

            const selectedEmployee = answer.employee.split(' ');
            const firstName = selectedEmployee[0];
            const lastName = selectedEmployee[1];

            const query = `SELECT title FROM role;`;

            connection.query(query, (err, data) => {

                const roles = data.map((item) => item.title);

                inquirer.prompt({

                    name: 'role',
                    type: 'list',
                    message: 'Please select the employees new role',
                    choices: roles,

                })
                .then((answer) => {

                    const query = `SELECT id FROM role WHERE title = ?`;

                    connection.query(query, [answer.role], (err, data) => {

                        if(err) throw err;
                        const roleId = data[0].id;
                        const query = `UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?`;

                        connection.query(

                            query,
                            [roleId, firstName, lastName],
                            (err, data) => {

                                if(err) throw err;
                                console.log(`Updated ${firstName} ${lastName}'s role successfully`);
                                viewAllEmployees();

                            }
                        
                        );

                    });

                });

            });

        });

    });

}

// Update Employee's Manager
function updateEmployeeManager() {

    const query = `SELECT first_name, last_name FROM employee;`;

    connection.query(query, (err, data) => {

        const employees = data.map((item) => `${item.first_name} ${item.last_name}`);

        inquirer.prompt([

            {

                name: 'employee',
                type: 'list',
                message: 'Please select the employee to update: ',
                choices: employees,

            },

        ])
        .then((answer) => {

            const selectedEmployee = answer.employee.split(' ');
            const firstName = selectedEmployee[0];
            const lastName = selectedEmployee[1];

            const query = `SELECT 
            first_name, last_name 
            FROM employee 
            WHERE manager_id IS NULL 
            AND first_name != '${firstName}' 
            AND last_name != '${lastName}';`;

            connection.query(query, (err, data) => {

                const managers = data.map((item) => `${item.first_name} ${item.last_name}`);

                inquirer.prompt({

                    name: 'manager',
                    type: 'list',
                    message: 'Please select the employees new manager: ',
                    choices: managers,

                })
                .then((answer) => {

                    const query = `SELECT id FROM employee WHERE first_name = ? AND last_name = ?`;

                    connection.query(query, [answer.manager.split(' ')[0], answer.manager.split(' ')[1]], (err, data) => {

                        if(err) throw err;
                        const managerId = data[0].id;
                        const query = `UPDATE employee SET manager_id = ? WHERE first_name = ? AND last_name = ?`;

                        connection.query(

                            query,
                            [managerId, firstName, lastName],
                            (err, data) => {

                                if(err) throw err;
                                console.log(`Updated ${firstName} ${lastName}'s manager to ${answer.manager} successfully`);
                                viewAllEmployees();

                            }

                        );

                    });

                });

            });

        });

    });
    
}

// View All Roles
function viewAllRoles() {

    const query = `SELECT 
    role.id, 
    role.title, 
    role.salary, 
    department.name AS department 
    FROM role 
    LEFT JOIN department ON 
    role.department_id = department.id;`;

    connection.query(query, (err, data) => {

        if(err) throw err;
        console.table(data);
        mainMenu();

    });

}

// Add Role
function addRole() {

    const query = `SELECT department.name FROM department`;


    connection.query(query, (err, data) => {

        if(err) throw err;
        const departments = data.map((item) => `${item.name}`);
        
        inquirer.prompt([

            {

                type: 'input',
                name: 'title',
                message: 'Please type the title of the new role: ',

            },
            {

                type: 'input',
                name: 'salary',
                message: 'Please type the salary of the new role: ',

            },
            {

                type: 'list',
                name: 'department_name',
                message: 'Please select the department of the new role: ',
                choices: [...departments],

            },

        ])
        .then((data) => {

            const [title, salary, department_name] = data;

            connection.query(

            `INSERT INTO role (title, salary, department_id)
             SELECT ?, ?, department.id
             FROM department
             WHERE department.name = ?`,
             [title, salary, department_name],
             (err, data) => {

                if(err) throw err;
                console.log(`${title} role has been added succesffuly`);
                viewAllRoles();

             }

            );

        });

    });

}

// Remove Role
function removeRole() {

    connection.query('SELECT role.title FROM role', (err, data) => {

        const roles = data.map((item) => `${item.title}`);

        inquirer.prompt([

            {

                type: 'list',
                name: 'title',
                message: 'Please select the role to remove: ',
                choices: [...roles],

            },

        ])
        .then((data) => {

            const {title} = data;

            connection.query(

                "SELECT * FROM role WHERE title = '" + title + "'",
                (err, res) => {

                    if(err) throw err;
                    if(res.length === 0) {

                        console.log(`Role ${data.title} does not exist`);   

                    }

                    if(res.length !== 0) {

                        connection.query(

                            "DELETE FROM role WHERE title = '" + title + "'",
                            (err, res) => {

                                if(err) throw err;
                                if(res.affectedRows === 0) {

                                    console.log(`Role ${data.title} does not exist`);

                                }
                                else {

                                    console.table({

                                        message: `Role ${data.title} has been successfully removed`,
                                        affectedRows: res.affectedRows,

                                    });

                                    viewAllRoles();

                                }

                            }

                        );

                    }

                }

            );

        });

    });

}

// View All Departments
function viewAllDepartments() {

    const query = `SELECT 
    department.id, 
    department.name FROM 
    department;`;

    connection.query(query, (err, data) => {

        if(err) throw err;
        console.table(data);
        mainMenu();

    });

}

// Add Department
function addDepartment() {

    inquirer.prompt([

        {

            type: 'input',
            name: 'name',
            message: 'Please type the name of the new department',

        },

    ])
    .then((data) => {

        const {name} = data;

        connection.query(

            `INSERT INTO department (name) VALUES (?)`,
            [name],
            (err, res) => {

                if(err) throw err;
                console.log(`${name} department has been successfully added`);
                viewAllDepartments();

            }

        );

    });

}

// Remove Department
function removeDepartment() {

    connection.query('SELECT department.name FROM department', (err, data) => {

        const departments = data.map((item) => `${item.name}`);

        inquirer.prompt([

        {

            type: 'list',
            name: 'name',
            message: 'Please select the department to be removed: ',
            choices: [...departments],

        },

        ])
        .then((data) => {

            const {name} = data;

            connection.query(

                "SELECT * FROM department WHERE name = '" + name + "'",
                (err, res) => {

                    if(err) throw err;
                    if(res.length === 0) {

                        console.log(`${data.name} department does not exist`);

                    }

                    if(res.length !== 0) {

                        connection.query(

                            "DELETE FROM department WHERE name = '" + name + "'",
                            (err, res) => {

                                if(err) throw err;
                                if(res.affectedRows === 0) {

                                    console.log(`${data.name} department does not exist`);

                                }
                                else {

                                    console.table({

                                        message: `${data.name} department has been successfully removed`,
                                        affectedRows: res.affectedRows,

                                    });
                                    viewAllDepartments();

                                }

                            }

                        );

                    }

                }

            );

        });

    });

}

// Total Utilized Budget By Department
function viewTotalUtilizedBudgetByDepartment() {

    const query = `SELECT department.name AS department, 
    SUM(role.salary) AS utilized_budget FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id 
    GROUP BY department.name;`;

    connection.query(query, (err, data) => {

        if(err) throw err;
        console.table(data);
        mainMenu();

    });

}

// Quit
function quit() {

    console.log('Quitted the app successfully');
    connection.end();

}

mainMenu();