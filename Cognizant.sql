#S1 E1
DELIMITER // 

CREATE PROCEDURE ApplySeniorDiscount()
BEGIN
    UPDATE Loans l
    JOIN Customers c ON l.CustomerID = c.CustomerID
    SET l.InterestRate = l.InterestRate - 1
    WHERE TIMESTAMPDIFF(YEAR,c.DOB,CURDATE()) > 60;
END//

DELIMITER ;
#S2 E1
UPDATE Customers
SET IsVIP = TRUE
WHERE Balance > 10000;
#S3 E1
SELECT CONCAT('Reminder for ',c.Name,' Loan Due: ',l.EndDate)
FROM Customers c
JOIN Loans l ON c.CustomerID=l.CustomerID
WHERE l.EndDate BETWEEN CURDATE()
AND DATE_ADD(CURDATE(),INTERVAL 30 DAY);
#S1 E2
DELIMITER //

CREATE PROCEDURE SafeTransferFunds(
IN p_from INT,
IN p_to INT,
IN p_amount DECIMAL(10,2)
)
BEGIN
DECLARE bal DECIMAL(10,2);

START TRANSACTION;

SELECT Balance INTO bal
FROM Accounts
WHERE AccountID=p_from;

IF bal < p_amount THEN
    ROLLBACK;
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT='Insufficient Funds';
ELSE
    UPDATE Accounts
    SET Balance=Balance-p_amount
    WHERE AccountID=p_from;

    UPDATE Accounts
    SET Balance=Balance+p_amount
    WHERE AccountID=p_to;

    COMMIT;
END IF;

END//

DELIMITER ;
#S2 E2
DELIMITER //

CREATE PROCEDURE UpdateSalary(
IN p_empid INT,
IN p_percent DECIMAL(5,2)
)
BEGIN

IF EXISTS(SELECT 1 FROM Employees
          WHERE EmployeeID=p_empid) THEN

   UPDATE Employees
   SET Salary=Salary+(Salary*p_percent/100)
   WHERE EmployeeID=p_empid;

ELSE
   SIGNAL SQLSTATE '45000'
   SET MESSAGE_TEXT='Employee Not Found';
END IF;

END//

DELIMITER ;
#S3 E2
DELIMITER //

CREATE PROCEDURE AddNewCustomer(
IN p_id INT,
IN p_name VARCHAR(100),
IN p_dob DATE,
IN p_balance DECIMAL(10,2)
)
BEGIN

IF EXISTS(SELECT 1
          FROM Customers
          WHERE CustomerID=p_id) THEN

   SIGNAL SQLSTATE '45000'
   SET MESSAGE_TEXT='Customer Already Exists';

ELSE

   INSERT INTO Customers
   VALUES(p_id,p_name,p_dob,p_balance,NOW());

END IF;

END//

DELIMITER ;
#S1 E3
DELIMITER //

CREATE PROCEDURE ProcessMonthlyInterest()
BEGIN
    UPDATE Accounts
    SET Balance=Balance*1.01
    WHERE AccountType='Savings';
END//

DELIMITER ;
#S2 E3
DELIMITER //

CREATE PROCEDURE UpdateEmployeeBonus(
IN p_department VARCHAR(50),
IN p_bonus DECIMAL(5,2)
)
BEGIN
   UPDATE Employees
   SET Salary=Salary+(Salary*p_bonus/100)
   WHERE Department=p_department;
END//

DELIMITER ;
#S3 E3
DELIMITER //

CREATE PROCEDURE TransferFunds(
IN p_from INT,
IN p_to INT,
IN p_amount DECIMAL(10,2)
)
BEGIN

IF (SELECT Balance
    FROM Accounts
    WHERE AccountID=p_from) >= p_amount THEN

    UPDATE Accounts
    SET Balance=Balance-p_amount
    WHERE AccountID=p_from;

    UPDATE Accounts
    SET Balance=Balance+p_amount
    WHERE AccountID=p_to;

END IF;

END//

DELIMITER ;
#S1 E4
DELIMITER //

CREATE FUNCTION CalculateAge(
p_dob DATE
)
RETURNS INT
DETERMINISTIC
BEGIN
RETURN TIMESTAMPDIFF(YEAR,p_dob,CURDATE());
END//

DELIMITER ;
#S2 E4
DELIMITER //

CREATE FUNCTION CalculateMonthlyInstallment(
p_amount DECIMAL(10,2),
p_rate DECIMAL(5,2),
p_years INT
)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
RETURN (p_amount +
(p_amount*p_rate*p_years/100))
/ (p_years*12);
END//

DELIMITER ;
#S3 E4
DELIMITER //

CREATE FUNCTION HasSufficientBalance(
p_account INT,
p_amount DECIMAL(10,2)
)
RETURNS BOOLEAN
DETERMINISTIC
BEGIN

DECLARE bal DECIMAL(10,2);

SELECT Balance
INTO bal
FROM Accounts
WHERE AccountID=p_account;

RETURN bal >= p_amount;

END//

DELIMITER ;
#S1 E5
DELIMITER //

CREATE TRIGGER UpdateCustomerLastModified
BEFORE UPDATE ON Customers
FOR EACH ROW
BEGIN
SET NEW.LastModified=NOW();
END//

DELIMITER ;
#S2 E5
CREATE TABLE AuditLog(
AuditID INT AUTO_INCREMENT PRIMARY KEY,
TransactionID INT,
LogDate DATETIME
);
DELIMITER //

CREATE TRIGGER LogTransaction
AFTER INSERT ON Transactions
FOR EACH ROW
BEGIN

INSERT INTO AuditLog(
TransactionID,
LogDate
)
VALUES(
NEW.TransactionID,
NOW()
);

END//

DELIMITER ;
#S3 E5
DELIMITER //

CREATE TRIGGER CheckTransactionRules
BEFORE INSERT ON Transactions
FOR EACH ROW
BEGIN

DECLARE bal DECIMAL(10,2);

IF NEW.TransactionType='Deposit'
AND NEW.Amount<=0 THEN

SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT='Invalid Deposit';

END IF;

IF NEW.TransactionType='Withdrawal' THEN

SELECT Balance INTO bal
FROM Accounts
WHERE AccountID=NEW.AccountID;

IF NEW.Amount>bal THEN

SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT='Insufficient Balance';

END IF;

END IF;

END//

DELIMITER ;
#S1 E6
DECLARE done INT DEFAULT FALSE;
DECLARE cname VARCHAR(100);

DECLARE cur CURSOR FOR
SELECT Name FROM Customers;

DECLARE CONTINUE HANDLER FOR NOT FOUND
SET done=TRUE;
#S2 E6
UPDATE Accounts
SET Balance=Balance-100;
#S3 E6
UPDATE Loans
SET InterestRate=InterestRate+0.5;
#S1 E7
CREATE PROCEDURE AddCustomer(...)
#S2 E7
CREATE PROCEDURE UpdateCustomer(...)
#S3 E7
CREATE FUNCTION GetCustomerBalance(...)