
use syncmate;

CREATE TABLE IF NOT EXISTS users(
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(80) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(80) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    profession ENUM('student','teacher','developer','professional') NOT NULL DEFAULT 'developer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

