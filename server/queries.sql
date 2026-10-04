-- 1. users table: stores user logins
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,   
    email VARCHAR(255) NOT NULL UNIQUE,    
    hashed_password VARCHAR(255) NOT NULL, 
    INDEX idx_user_email (email)           
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. notes table: stores each note
CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    title VARCHAR(255) NOT NULL,      
    content TEXT NULL,                 
    user_id INT NULL,                 
    CONSTRAINT fk_notes_user
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE              
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
