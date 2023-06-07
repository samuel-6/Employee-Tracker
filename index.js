// Sets up dependencies for Node.js

// Inquirer for user input
const inquirer = require('insquirer');
// Establishes a connection to the db
const connection = require('./db/connection');
// Console.table for tabluar data
require('console.table');

const mainMenu = () => {

    console.log('Welcome to Employee Manager');
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