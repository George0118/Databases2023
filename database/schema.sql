-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
SET GLOBAL event_scheduler=ON;
-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mydb` ;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
-- -----------------------------------------------------
-- Schema phpmyadmin
-- -----------------------------------------------------
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`School Unit`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`SchoolUnit` ;

CREATE TABLE IF NOT EXISTS `mydb`.`SchoolUnit` (
  `IdSchool` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL UNIQUE,
  `Adress_street` VARCHAR(45) NOT NULL,
  `Adress_number` INT NOT NULL,
  `Adress_city` VARCHAR(45) NOT NULL,
  `Email` VARCHAR(45) NOT NULL,
  `SchoolPrinciple` VARCHAR(45) NOT NULL,
  `SchoolAdmin` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`IdSchool`),
  CONSTRAINT `CK_Email_Format` CHECK (`Email` REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')
) ENGINE = InnoDB;

CREATE UNIQUE INDEX `ID_UNIQUE` ON `mydb`.`SchoolUnit` (`IdSchool` ASC);

CREATE TABLE IF NOT EXISTS `mydb`.`Telephone` (
  `IdSchool` INT NOT NULL,
  `PhoneNumber` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`PhoneNumber`),
  CONSTRAINT `chk_PhoneNumber` CHECK (LENGTH(`PhoneNumber`) >= 8),
  FOREIGN KEY (`IdSchool`) REFERENCES `mydb`.`SchoolUnit` (`IdSchool`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Book`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Book` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Book` (
  `ISBN` VARCHAR(17) NOT NULL,
  `Title` VARCHAR(100) NOT NULL,
  `Publisher` VARCHAR(45) NOT NULL,
  `PageNumber` INT NOT NULL,
  `Summary` TEXT NOT NULL,
  `Picture` VARCHAR(255) NULL,
  `Language` VARCHAR(45) NOT NULL,
  `Rating` DECIMAL(3,2) NOT NULL,
  PRIMARY KEY (`ISBN`),
  CONSTRAINT `CK_ISBN` CHECK (`ISBN` REGEXP '^(978|979)\\d{1,5}\\d{1,7}\\d{1,6}\\d|X$' OR `ISBN` REGEXP '^(978|979) \\d{1,5} \\d{1,7} \\d{1,6} \\d|X$'),
  CONSTRAINT `CK_PAGENUMBER` CHECK (`PageNumber` >= 0 AND `PageNumber` <= 4000), 
  CONSTRAINT `CK_LANGUAGE` CHECK (`Language` IN ("AFR", "AMH", "ARA", "ASM", "AYM", "AZE", "BEN", "BIS", "BHO", "BUL", "BUR", "CAT", "CEB", "CES", "CHI", "CMN", "CRO", "CZE", "DAN", "DEU", "DUT", "ENG", "EST", "EWE", "FIN", "FRA", "FUL", "GLG", "GLE", "GRE", "GUI", "GUJ", "HAT", "HAU", "HEB", "HIN", "HMO", "HRV", "HUN", "IBO", "ILO", "ITA", "JAV", "KAL", "KAN", "KAZ", "KHM", "KIK", "KIN", "KIR", "KOR", "KUR", "LAT", "LAV", "LIT", "LOZ", "LUG", "MAI", "MAL", "MAO", "MAR", "MAY", "MSA", "MON", "NEP", "NOB", "NYA", "ORI", "PAN", "POL", "PUS", "QUE", "RAR", "RON", "RUN", "RUS", "SLK", "SLV", "SOM", "SOT", "SPA", "SRP", "SWE", "SWA", "TAI", "TAM", "TGL", "TIR", "TON", "TUM", "TUR", "UZB", "VIE", "WOL", "YOR", "YUE", "ZUL"))
)
ENGINE = InnoDB;

CREATE UNIQUE INDEX `ID_UNIQUE` ON `mydb`.`Book` (`ISBN` ASC);


-- -----------------------------------------------------
-- Table `mydb`.`Book_Writers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Book_Writers` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Book_Writers` (
  `WriterName` VARCHAR(60) NOT NULL,
  `ISBN` VARCHAR(17) NOT NULL,
  PRIMARY KEY (`ISBN`, `WriterName`),
  CONSTRAINT
    FOREIGN KEY (`ISBN`)
    REFERENCES `mydb`.`Book` (`ISBN`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Book_Categories`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Book_Categories` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Book_Categories` (
  `Category` ENUM ('Ιστορία (History)', 'Μυθιστόρημα (Novel)', 'Φαντασία (Fantasy)', 'Μυστήριο (Mystery)', 'Θρίλερ (Thriller)', 'Ρομαντικό (Romance)', 'Ποίηση (Poetry)', 'Διηγήματα (Short Stories)', 'Αυτοβελτίωση (Self-Improvement)', 'Θρησκεία (Religion)', 'Φιλοσοφία (Philosophy)', 'Ψυχολογία (Psychology)', 'Παιδικά βιβλία (Childrens Books)', 'Ταξίδια (Travel)', 'Τέχνη (Art)', 'Αρχιτεκτονική (Architecture)', 'Μαγειρική (Cooking)', 'Αθλητισμός (Sports)', 'Επιστημονικά (Science)', 'Οικονομία (Economics)', 'Πολιτική (Politics)', 'Βιογραφίες (Biographies)', 'Μαθηματικά (Mathematics)', 'Γλωσσολογία (Linguistics)', 'Εκπαίδευση (Education)', 'Περιβάλλον (Environment)', 'Κοινωνιολογία (Sociology)', 'Μουσική (Music)', 'Δικαίωμα (Law)', 'Επιστημονική Φαντασία (Science Fiction)', 'Φανταστική Νεανική Λογοτεχνία (Young Adult Fantasy)', 'Ιστορικό Μυθιστόρημα (Historical Novel)', 'Πολεμική Λογοτεχνία (War Literature)', 'Αστυνομική Λογοτεχνία (Crime Fiction)', 'Επιστημονική Διαφήμιση (Science Non-Fiction)', 'Αυτοβιογραφία (Autobiography)', 'Μαγικό Ρεαλισμό (Magical Realism)', 'Θρησκευτική Λογοτεχνία (Religious Literature)', 'Κλασική Λογοτεχνία (Classic Literature)', 'Περιπέτεια (Adventure)', 'Παραμύθια (Fairy Tales)', 'Μυθολογία (Mythology)', 'Τραγωδία (Tragedy)', 'Κωμωδία (Comedy)', 'Θέατρο (Theater)', 'Τεχνολογία (Technology)', 'Επιστήμη της Υγείας (Health Science)', 'Περιπλανήσεις (Journeys)', 'Πολιτισμολογία (Cultural Studies)'),
  `ISBN` VARCHAR(17) NOT NULL,
  PRIMARY KEY(`ISBN`, `Category`),
  CONSTRAINT 
    FOREIGN KEY (`ISBN`)
    REFERENCES `mydb`.`Book` (`ISBN`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Book_Keywords`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Book_Keywords` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Book_Keywords` (
  `Keyword` VARCHAR(45) NOT NULL,
  `ISBN` VARCHAR(17) NOT NULL,
  PRIMARY KEY(`ISBN`, `Keyword`),
  CONSTRAINT
    FOREIGN KEY (`ISBN`)
    REFERENCES `mydb`.`Book` (`ISBN`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Users` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Users` (
  `IdUsers` INT NOT NULL AUTO_INCREMENT,
  `Username` VARCHAR(50) NOT NULL UNIQUE,
  `Password` VARCHAR(20) NOT NULL,
  `Approved` INT NOT NULL,
  PRIMARY KEY (`IdUsers`),
  CONSTRAINT `chk_Username` CHECK (LENGTH(`Username`) >= 5),
  CONSTRAINT `chk_Password` CHECK (LENGTH(`Password`) >= 5))
ENGINE = InnoDB;

CREATE UNIQUE INDEX `Username_UNIQUE` ON `mydb`.`Users` (`Username` ASC);


-- -----------------------------------------------------
-- Table `mydb`.`GeneralAdmin`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`GeneralAdmin` ;

CREATE TABLE IF NOT EXISTS `mydb`.`GeneralAdmin` (
  `IdGeneralAdmin` INT NOT NULL AUTO_INCREMENT,
  `IdUsers` INT NOT NULL,
  `Name` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`IdGeneralAdmin`),
  CONSTRAINT
    FOREIGN KEY (`IdUsers`)
    REFERENCES `mydb`.`Users` (`IdUsers`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

CREATE UNIQUE INDEX `IdGeneralAdmin_UNIQUE` ON `mydb`.`GeneralAdmin` (`IdGeneralAdmin` ASC);


-- -----------------------------------------------------
-- Table `mydb`.`SchoolAdmin`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`SchoolAdmin` ;

CREATE TABLE IF NOT EXISTS `mydb`.`SchoolAdmin` (
  `IdUsers` INT NOT NULL,
  `IdSchool` INT NOT NULL,
  `Name` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`IdUsers`, `IdSchool`),
  CONSTRAINT
    FOREIGN KEY (`IdUsers`)
    REFERENCES `mydb`.`Users` (`IdUsers`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT
    FOREIGN KEY (`IdSchool`)
    REFERENCES `mydb`.`SchoolUnit` (`IdSchool`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `mydb`.`Student`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Student` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Student` (
  `StudentName` VARCHAR(60) NOT NULL,
  `Adress_street` VARCHAR(45) NOT NULL,
  `Adress_number` INT NOT NULL,
  `Adress_city` VARCHAR(45) NOT NULL,
  `StudentEmail` VARCHAR(100) NOT NULL,
  `BirthDate` DATE NOT NULL,
  `BooksToBorrow` INT NOT NULL,
  `BooksToReserve` INT NOT NULL,
  `IdUsers` INT NOT NULL,
  `IdSchool` INT NOT NULL,
  PRIMARY KEY(`IdUsers`),
  CONSTRAINT
    FOREIGN KEY (`IdUsers`)
    REFERENCES `mydb`.`Users` (`IdUsers`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT
    FOREIGN KEY (`IdSchool`)
    REFERENCES `mydb`.`SchoolUnit` (`IdSchool`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    CONSTRAINT `CK_StudentEmail_Format` CHECK (`StudentEmail` REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    CONSTRAINT `CK_BooksToBorrow` CHECK (`BooksToBorrow` >= 0 AND `BooksToBorrow` <= 2),
    CONSTRAINT `CK_BooksToReserve` CHECK (`BooksToReserve` >= 0 AND `BooksToReserve` <= 2))
ENGINE = InnoDB;

CREATE EVENT IF NOT EXISTS weekly_update_books_students
ON SCHEDULE EVERY 1 WEEK
DO
  UPDATE `mydb`.`Student`
  SET `BooksToBorrow` = 2, `BooksToReserve` = 2;


DELIMITER //
CREATE TRIGGER check_student_age_constraint
BEFORE INSERT ON Student
FOR EACH ROW
BEGIN
  DECLARE age INT;
  SET age = YEAR(CURDATE()) - YEAR(NEW.`BirthDate`);
  IF age < 6 OR age > 20 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Age constraint violation: Users must be between 6 and 20 years old.';
  END IF;
END //
DELIMITER ;


-- -----------------------------------------------------
-- Table `mydb`.`Teacher`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Teacher` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Teacher` (
  `TeacherName` VARCHAR(60) NOT NULL,
  `Adress_street` VARCHAR(45) NOT NULL,
  `Adress_number` INT NOT NULL,
  `Adress_city` VARCHAR(45) NOT NULL,
  `TeacherEmail` VARCHAR(100) NOT NULL UNIQUE,
  `BirthDate` DATE NOT NULL,
  `BooksToBorrow` INT NOT NULL,
  `BooksToReserve` INT NOT NULL,
  `IdUsers` INT NOT NULL,
  `IdSchool` INT NOT NULL,
  PRIMARY KEY(`IdUsers`, `IdSchool`),	
  CONSTRAINT
    FOREIGN KEY (`IdUsers`)
    REFERENCES `mydb`.`Users` (`IdUsers`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT
    FOREIGN KEY (`IdSchool`)
    REFERENCES `mydb`.`SchoolUnit` (`IdSchool`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    CONSTRAINT `CK_TeacherEmail_Format` CHECK (`TeacherEmail` REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
    CONSTRAINT `CK_BooksToBorrow` CHECK (`BooksToBorrow` >= 0 AND `BooksToBorrow` <= 1),
    CONSTRAINT `CK_BooksToReserve` CHECK (`BooksToReserve` >= 0 AND `BooksToReserve` <= 1))
ENGINE = InnoDB;

CREATE EVENT IF NOT EXISTS weekly_update_books_teachers
ON SCHEDULE EVERY 1 WEEK
DO
  UPDATE `mydb`.`Teacher`
  SET `BooksToBorrow` = 1, `BooksToReserve` = 1;

DELIMITER //
CREATE TRIGGER check_teacher_age_constraint
BEFORE INSERT ON Teacher
FOR EACH ROW
BEGIN
  DECLARE age INT;
  SET age = YEAR(CURDATE()) - YEAR(NEW.`BirthDate`);
  IF age < 25 OR age > 67 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Age constraint violation: Teachers must be between 25 and 67 years old.';
  END IF;
END //
DELIMITER ;

DROP TABLE IF EXISTS `mydb`.`TelephoneUser` ;

CREATE TABLE IF NOT EXISTS `mydb`.`TelephoneUser` (
  `IdUsers` INT NOT NULL,
  `PhoneNumber` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`PhoneNumber`),
  CONSTRAINT `chk_PhoneNumber` CHECK (LENGTH(`PhoneNumber`) >= 8),
  FOREIGN KEY (`IdUsers`) REFERENCES `mydb`.`Users` (`IdUsers`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `mydb`.`Availability`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Availability` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Availability` (
  `Copies` INT NOT NULL,
  `AvailableCopies` INT NOT NULL,
  `ReservedCopies` INT NOT NULL,
  `IdSchool` INT NOT NULL,
  `ISBN` VARCHAR(17) NOT NULL,
  PRIMARY KEY(`ISBN`, `IdSchool`),
  CONSTRAINT
    FOREIGN KEY (`IdSchool`)
    REFERENCES `mydb`.`SchoolUnit` (`IdSchool`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT
    FOREIGN KEY (`ISBN`)
    REFERENCES `mydb`.`Book` (`ISBN`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    CONSTRAINT `CK_Copies` CHECK (`Copies` > 0),
    CONSTRAINT `CK_AvailableCopies` CHECK (`AvailableCopies` >= 0 AND `AvailableCopies` <= `Copies`),
    CONSTRAINT `CK_ReservedCopies` CHECK (`ReservedCopies` >= 0 AND `ReservedCopies` <= `AvailableCopies`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Borrowing`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Borrowing` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Borrowing` (
  `BorrowingID` INT NOT NULL AUTO_INCREMENT,
  `BorrowDate` DATE NOT NULL,
  `Returned` INT NOT NULL,
  `IdUsers` INT NOT NULL,
  `ISBN` VARCHAR(17) NOT NULL,
  `Approved` INT NOT NULL,
  PRIMARY KEY (`BorrowingID`),
  CONSTRAINT
    FOREIGN KEY (`IdUsers`)
    REFERENCES `mydb`.`Users` (`IdUsers`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT
    FOREIGN KEY (`ISBN`)
    REFERENCES `mydb`.`Book` (`ISBN`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

DELIMITER //

CREATE TRIGGER update_availability
AFTER INSERT ON Borrowing
FOR EACH ROW
BEGIN
    DECLARE school_id INT;
    DECLARE borrowed_copies INT;
    
    -- Get the school ID based on the user type (Student or Teacher)
    IF NEW.IdUsers IN (SELECT IdUsers FROM Student) THEN
        SELECT IdSchool INTO school_id FROM Student WHERE IdUsers = NEW.IdUsers;
    ELSE
        SELECT IdSchool INTO school_id FROM Teacher WHERE IdUsers = NEW.IdUsers;
    END IF;
    
    -- Get the number of borrowed copies for the specific school and ISBN
    SELECT COUNT(*) INTO borrowed_copies 
    FROM Borrowing 
    WHERE Returned = 0 
        AND IdUsers IN (
            SELECT IdUsers FROM Student WHERE IdSchool = school_id
            UNION ALL
            SELECT IdUsers FROM Teacher WHERE IdSchool = school_id
        )
        AND ISBN = NEW.ISBN;
        
    -- Update the AvailableCopies in the Availability table
    UPDATE Availability SET AvailableCopies = Copies - borrowed_copies WHERE IdSchool = school_id AND ISBN = NEW.ISBN;
END//

DELIMITER ;


DELIMITER //

CREATE TRIGGER update_availability1
AFTER UPDATE ON Borrowing
FOR EACH ROW
BEGIN
    DECLARE school_id INT;
    DECLARE borrowed_copies INT;
    
    -- Get the school ID based on the user type (Student or Teacher)
    IF NEW.IdUsers IN (SELECT IdUsers FROM Student) THEN
        SELECT IdSchool INTO school_id FROM Student WHERE IdUsers = NEW.IdUsers;
    ELSE
        SELECT IdSchool INTO school_id FROM Teacher WHERE IdUsers = NEW.IdUsers;
    END IF;
    
    -- Get the number of borrowed copies for the specific school and ISBN
    SELECT COUNT(*) INTO borrowed_copies 
    FROM Borrowing 
    WHERE Returned = 0 
        AND IdUsers IN (
            SELECT IdUsers FROM Student WHERE IdSchool = school_id
            UNION ALL
            SELECT IdUsers FROM Teacher WHERE IdSchool = school_id
        )
        AND ISBN = NEW.ISBN;
        
    -- Update the AvailableCopies in the Availability table
    UPDATE Availability SET AvailableCopies = Copies - borrowed_copies WHERE IdSchool = school_id AND ISBN = NEW.ISBN;
END//

DELIMITER ;

DELIMITER //

CREATE TRIGGER update_availability2
AFTER DELETE ON Borrowing
FOR EACH ROW
BEGIN
    DECLARE school_id INT;
    DECLARE borrowed_copies INT;
    
    -- Get the school ID based on the user type (Student or Teacher)
    IF OLD.IdUsers IN (SELECT IdUsers FROM Student) THEN
        SELECT IdSchool INTO school_id FROM Student WHERE IdUsers = OLD.IdUsers;
    ELSE
        SELECT IdSchool INTO school_id FROM Teacher WHERE IdUsers = OLD.IdUsers;
    END IF;
    
    -- Get the number of borrowed copies for the specific school and ISBN
    SELECT COUNT(*) INTO borrowed_copies 
    FROM Borrowing 
    WHERE Returned = 0 
        AND IdUsers IN (
            SELECT IdUsers FROM Student WHERE IdSchool = school_id
            UNION ALL
            SELECT IdUsers FROM Teacher WHERE IdSchool = school_id
        )
        AND ISBN = OLD.ISBN;
        
    -- Update the AvailableCopies in the Availability table
    UPDATE Availability SET AvailableCopies = Copies - borrowed_copies WHERE IdSchool = school_id AND ISBN = OLD.ISBN;
END//

DELIMITER ;


DELIMITER //

CREATE TRIGGER calculate_teacher_books_left
AFTER INSERT ON Borrowing
FOR EACH ROW
BEGIN
    DECLARE user_id INT;
    DECLARE total_borrowed INT;
    DECLARE books_left INT;

    -- Get the user ID of the borrower from the inserted row
    SET user_id = NEW.IdUsers;

    -- Calculate the total number of books borrowed by the user
    SELECT COUNT(*) INTO total_borrowed
    FROM Borrowing
    WHERE (user_id = IdUsers
      AND Returned = 'False');

    -- Calculate the number of books left to borrow
    SET books_left = 1 - total_borrowed;

    -- Update the "books_left" column in the "users" table
    UPDATE Teacher SET BooksToBorrow = books_left WHERE IdUsers = user_id;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER calculate_student_books_left
AFTER INSERT ON Borrowing
FOR EACH ROW
BEGIN
    DECLARE user_id INT;
    DECLARE total_borrowed INT;
    DECLARE books_left INT;

    -- Get the user ID of the borrower from the inserted row
    SET user_id = NEW.IdUsers;

    -- Calculate the total number of books borrowed by the user
    SELECT COUNT(*) INTO total_borrowed
    FROM Borrowing
    WHERE (user_id = IdUsers
      AND Returned = 'False');

    -- Calculate the number of books left to borrow
    SET books_left = 2 - total_borrowed;

    -- Update the "books_left" column in the "users" table
    UPDATE Student SET BooksToBorrow = books_left WHERE IdUsers = user_id;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER calculate_teacher_books_left_1
AFTER UPDATE ON Borrowing
FOR EACH ROW
BEGIN
    DECLARE user_id INT;
    DECLARE total_borrowed INT;
    DECLARE books_left INT;

    -- Get the user ID of the borrower from the inserted row
    SET user_id = NEW.IdUsers;

    -- Calculate the total number of books borrowed by the user
    SELECT COUNT(*) INTO total_borrowed
    FROM Borrowing
    WHERE (user_id = IdUsers
      AND Returned = 'False');

    -- Calculate the number of books left to borrow
    SET books_left = 1 - total_borrowed;

    -- Update the "books_left" column in the "users" table
    UPDATE Teacher SET BooksToBorrow = books_left WHERE IdUsers = user_id;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER calculate_student_books_left_1
AFTER UPDATE ON Borrowing
FOR EACH ROW
BEGIN
    DECLARE user_id INT;
    DECLARE total_borrowed INT;
    DECLARE books_left INT;

    -- Get the user ID of the borrower from the inserted row
    SET user_id = NEW.IdUsers;

    -- Calculate the total number of books borrowed by the user
    SELECT COUNT(*) INTO total_borrowed
    FROM Borrowing
    WHERE user_id = IdUsers
      AND Returned = 'False';

    -- Calculate the number of books left to borrow
    SET books_left = 2 - total_borrowed;

    -- Update the "books_left" column in the "users" table
    UPDATE Student SET BooksToBorrow = books_left WHERE IdUsers = user_id;
END //

DELIMITER ;

-- -----------------------------------------------------
-- Table `mydb`.`Reservation`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Reservation` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Reservation` (
  `ReservationID` INT NOT NULL AUTO_INCREMENT,
  `ReservationDate` DATE NOT NULL,
  `IdUsers` INT NOT NULL,
  `ISBN` VARCHAR(17) NOT NULL,
  `Approved` INT NOT NULL,
  PRIMARY KEY (`ReservationID`),
  CONSTRAINT
    FOREIGN KEY (`IdUsers`)
    REFERENCES `mydb`.`Users` (`IdUsers`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT
    FOREIGN KEY (`ISBN`)
    REFERENCES `mydb`.`Book` (`ISBN`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

CREATE EVENT delete_old_reservations_event
ON SCHEDULE EVERY 1 DAY
DO
  DELETE FROM Reservation
  WHERE ReservationDate < DATE_SUB(NOW(), INTERVAL 1 WEEK);

DELIMITER //

CREATE TRIGGER calculate_teacher_reservations_left
AFTER INSERT ON Reservation
FOR EACH ROW
BEGIN
    DECLARE user_id INT;
    DECLARE total_reserved INT;
    DECLARE reservations_left INT;

    -- Get the user ID of the borrower from the inserted row
    SET user_id = NEW.IdUsers;

    -- Calculate the total number of books borrowed by the user
    SELECT COUNT(*) INTO total_reserved
    FROM Reservation
    WHERE user_id = IdUsers;

    -- Calculate the number of books left to borrow
    SET reservations_left = 1 - total_reserved;

    -- Update the "books_left" column in the "users" table
    UPDATE Teacher SET BooksToReserve = reservations_left WHERE IdUsers = user_id;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER calculate_student_reservations_left
AFTER INSERT ON Reservation
FOR EACH ROW
BEGIN
    DECLARE user_id INT;
    DECLARE total_reserved INT;
    DECLARE reservations_left INT;

    -- Get the user ID of the borrower from the inserted row
    SET user_id = NEW.IdUsers;

    -- Calculate the total number of books borrowed by the user
    SELECT COUNT(*) INTO total_reserved
    FROM Reservation
    WHERE user_id = IdUsers;

    -- Calculate the number of books left to borrow
    SET reservations_left = 2 - total_reserved;

    -- Update the "books_left" column in the "users" table
    UPDATE Student SET BooksToReserve = reservations_left WHERE IdUsers = user_id;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER calculate_teacher_reservations_left_1
AFTER UPDATE ON Reservation
FOR EACH ROW
BEGIN
    DECLARE user_id INT;
    DECLARE total_reserved INT;
    DECLARE reservations_left INT;

    -- Get the user ID of the borrower from the inserted row
    SET user_id = NEW.IdUsers;

    -- Calculate the total number of books borrowed by the user
    SELECT COUNT(*) INTO total_reserved
    FROM Reservation
    WHERE user_id = IdUsers;

    -- Calculate the number of books left to borrow
    SET reservations_left = 1 - total_reserved;

    -- Update the "books_left" column in the "users" table
    UPDATE Teacher SET BooksToReserve = reservations_left WHERE IdUsers = user_id;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER calculate_student_reservations_left_1
AFTER UPDATE ON Reservation
FOR EACH ROW
BEGIN
    DECLARE user_id INT;
    DECLARE total_reserved INT;
    DECLARE reservations_left INT;

    -- Get the user ID of the borrower from the inserted row
    SET user_id = NEW.IdUsers;

    -- Calculate the total number of books borrowed by the user
    SELECT COUNT(*) INTO total_reserved
    FROM Reservation
    WHERE user_id = IdUsers;

    -- Calculate the number of books left to borrow
    SET reservations_left = 2 - total_reserved;

    -- Update the "books_left" column in the "users" table
    UPDATE Student SET BooksToReserve = reservations_left WHERE IdUsers = user_id;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER update_availability3
AFTER INSERT ON Reservation
FOR EACH ROW
BEGIN
    DECLARE school_id INT;
    DECLARE reserved_copies INT;
    
    -- Get the school ID based on the user type (Student or Teacher)
    IF NEW.IdUsers IN (SELECT IdUsers FROM Student) THEN
        SELECT IdSchool INTO school_id FROM Student WHERE IdUsers = NEW.IdUsers;
    ELSE
        SELECT IdSchool INTO school_id FROM Teacher WHERE IdUsers = NEW.IdUsers;
    END IF;
    
    -- Get the number of borrowed copies for the specific school and ISBN
    SELECT COUNT(*) INTO reserved_copies 
    FROM Reservation 
    WHERE IdUsers IN (
            SELECT IdUsers FROM Student WHERE IdSchool = school_id
            UNION ALL
            SELECT IdUsers FROM Teacher WHERE IdSchool = school_id
        )
        AND ISBN = NEW.ISBN;
        
    -- Update the AvailableCopies in the Availability table
    UPDATE Availability SET ReservedCopies = reserved_copies WHERE IdSchool = school_id AND ISBN = NEW.ISBN;
END//

DELIMITER ;

DELIMITER //

CREATE TRIGGER update_availability4
AFTER UPDATE ON Reservation
FOR EACH ROW
BEGIN
    DECLARE school_id INT;
    DECLARE reserved_copies INT;
    
    -- Get the school ID based on the user type (Student or Teacher)
    IF NEW.IdUsers IN (SELECT IdUsers FROM Student) THEN
        SELECT IdSchool INTO school_id FROM Student WHERE IdUsers = NEW.IdUsers;
    ELSE
        SELECT IdSchool INTO school_id FROM Teacher WHERE IdUsers = NEW.IdUsers;
    END IF;
    
    -- Get the number of borrowed copies for the specific school and ISBN
    SELECT COUNT(*) INTO reserved_copies 
    FROM Reservation 
    WHERE IdUsers IN (
            SELECT IdUsers FROM Student WHERE IdSchool = school_id
            UNION ALL
            SELECT IdUsers FROM Teacher WHERE IdSchool = school_id
        )
        AND ISBN = NEW.ISBN;
        
    -- Update the AvailableCopies in the Availability table
    UPDATE Availability SET ReservedCopies = reserved_copies WHERE IdSchool = school_id AND ISBN = NEW.ISBN;
END//

DELIMITER ;

DELIMITER //

CREATE TRIGGER update_availability5
AFTER DELETE ON Reservation
FOR EACH ROW
BEGIN
    DECLARE school_id INT;
    DECLARE reserved_copies INT;
    
    -- Get the school ID based on the user type (Student or Teacher)
    IF OLD.IdUsers IN (SELECT IdUsers FROM Student) THEN
        SELECT IdSchool INTO school_id FROM Student WHERE IdUsers = OLD.IdUsers;
    ELSE
        SELECT IdSchool INTO school_id FROM Teacher WHERE IdUsers = OLD.IdUsers;
    END IF;
    
    -- Get the number of borrowed copies for the specific school and ISBN
    SELECT COUNT(*) INTO reserved_copies 
    FROM Reservation 
    WHERE IdUsers IN (
            SELECT IdUsers FROM Student WHERE IdSchool = school_id
            UNION ALL
            SELECT IdUsers FROM Teacher WHERE IdSchool = school_id
        )
        AND ISBN = OLD.ISBN;
        
    -- Update the AvailableCopies in the Availability table
    UPDATE Availability SET ReservedCopies = reserved_copies WHERE IdSchool = school_id AND ISBN = OLD.ISBN;
END//

DELIMITER ;


-- -----------------------------------------------------
-- Table `mydb`.`Review`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Review` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Review` (
  `ReviewText` TEXT(200) NOT NULL,
  `RatingLikert` INT NOT NULL,
  `Approval` INT NOT NULL,
  `IdUsers` INT NOT NULL,
  `ISBN` VARCHAR(17) NOT NULL,
  PRIMARY KEY(`ISBN`, `IdUsers`),
  CONSTRAINT
    FOREIGN KEY (`IdUsers`)
    REFERENCES `mydb`.`Users` (`IdUsers`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT
    FOREIGN KEY (`ISBN`)
    REFERENCES `mydb`.`Book` (`ISBN`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `CK_RATING` CHECK (`RatingLikert` >= 1 AND `RatingLikert` <= 5))
ENGINE = InnoDB;

DELIMITER //
CREATE TRIGGER create_book_rating
AFTER INSERT ON `mydb`.`Review`
FOR EACH ROW
BEGIN
  DECLARE avg_rating DECIMAL(3, 2);

  SELECT AVG(RatingLikert) INTO avg_rating
  FROM `mydb`.`Review`
  WHERE ISBN = NEW.ISBN AND Approval = 1;

  IF avg_rating IS NOT NULL THEN
    UPDATE `mydb`.`Book`
    SET Rating = avg_rating
    WHERE ISBN = NEW.ISBN;
  END IF;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER update_book_rating
AFTER UPDATE ON `mydb`.`Review`
FOR EACH ROW
BEGIN
  DECLARE avg_rating DECIMAL(3, 2);

  SELECT AVG(RatingLikert) INTO avg_rating
  FROM `mydb`.`Review`
  WHERE ISBN = NEW.ISBN AND Approval = 1;

  IF avg_rating IS NOT NULL THEN
    UPDATE `mydb`.`Book`
    SET Rating = avg_rating
    WHERE ISBN = NEW.ISBN;
  END IF;
END //
DELIMITER ;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
