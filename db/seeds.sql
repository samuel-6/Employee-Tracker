INSERT INTO department (name)
VALUES  ('Human Resources'),
        ('Finance & Accounting'),
        ('Sales & Marketing'),
        ('Operations'),
        ('Information Technology');

INSERT INTO role (title, salary, department_id)
VALUES  ('Human Resources Manager', 75000, 1),
        ('Recruitment Specialist', 55000, 1),
        ('Financial Analyst', 70000, 2),
        ('Accountant', 60000, 2),
        ('Marketing Manager', 80000, 3),
        ('Sales Representative', 65000, 3),
        ('Operations Manager', 90000, 4),
        ('Supply Chain Analyst', 65000, 4),
        ('IT Manager', 110000, 5),
        ('Software Developer', 85000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Emily', 'Thompson', 1, NULL),
        ('James', 'Rodriguez', 2, 1),
        ('Lisa', 'Hamilton', 3, NULL),
        ('Michael', 'Bennett', 4, NULL),
        ('Olivia', 'Davis', 5, NULL),
        ('Ethan', 'Taylor', 6, 5),
        ('Ava', 'Martinez', 7, NULL),
        ('Jack', 'Nelson', 8, 7),
        ('Mia', 'Johnson', 9, NULL),
        ('William', 'Clark', 10, 9);