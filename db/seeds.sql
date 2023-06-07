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
        ('Sales Representative', 65000, 3),
        ('Marketing Manager', 80000, 3),
        ('Operations Manager', 90000, 4),
        ('Supply Chain Analyst', 65000, 4),
        ('IT Manager', 110000, 5),
        ('Software Developer', 85000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Emily', 'Thompson', 1, NULL),
        ('James', 'Rodriguez', 1, 1),
        ('Lisa', 'Hamilton', 2, NULL),
        ('Michael', 'Bennett', 2, NULL),
        ('Olivia', 'Davis', 3, NULL),
        ('Ethan', 'Taylor', 3, 3),
        ('Ava', 'Martinez', 4, 4),
        ('Jack', 'Nelson', 4, NULL),
        ('Mia', 'Johnson', 5, 5),
        ('William', 'Clark', 5, NULL);