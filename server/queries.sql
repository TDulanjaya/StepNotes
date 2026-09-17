-- 1. users table: stores user logins
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,     -- user id
    email VARCHAR(255) NOT NULL UNIQUE,    -- user email
    hashed_password VARCHAR(255) NOT NULL, -- encrypted password
    INDEX idx_user_email (email)           -- faster email lookup
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. notes table: stores each note
CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY, -- note id
    title VARCHAR(255) NOT NULL,       -- note title
    content TEXT NULL,                 -- note text
    user_id INT NULL,                  -- owner user id
    CONSTRAINT fk_notes_user
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE              -- delete notes if user is deleted
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
