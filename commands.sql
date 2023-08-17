CREATE TABLE blogs (
id SERIAL PRIMARY KEY,
author text,
url text NOT NULL,
title text NOT NULL,
likes INT DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes)
VALUES ('Author 1', 'https://www.blog1.com', 'Title 1', 10);

INSERT INTO blogs (author, url, title, likes)
VALUES ('Author 2', 'https://www.blog2.com', 'Title 2', 5);
