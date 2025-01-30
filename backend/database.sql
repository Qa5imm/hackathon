CREATE DATABASE IF NOT EXISTS mydb;
use mydb;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    google_sub VARCHAR(21) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- Insert sample data
INSERT INTO users (id, google_sub, first_name, last_name, email) VALUES
(1,'103928374659182746523', 'Alice', 'app','alice@example.com'),
(2,'208374659182746523091','Bob', 'web','bob@example.com');

INSERT INTO posts (user_id, title, content) VALUES
(1, 'My First Post', 'Alice\'s first post!'),
(2, 'Bob\'s First Post', 'Bob writes his first post.');
