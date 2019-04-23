CREATE TABLE IF NOT EXISTS Users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
  	password VARCHAR(255) NOT NULL,
	PRIMARY KEY (id),
	UNIQUE KEY (name)
);

CREATE TABLE IF NOT EXISTS Pages (
    id INT(11) NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    editor_id INT(11) NOT NULL,
    last_edit DATETIME NOT NULL,
    access INT(11) NOT NULL,
    PRIMARY KEY (id),
 	FOREIGN KEY (editor_id) 
        REFERENCES Users (id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS Sections (
    id INT(11) NOT NULL AUTO_INCREMENT,
    page_id INT(11) NOT NULL,
  	rank INT(11) NOT NULL,
  	heading VARCHAR(255) NOT NULL,
    link VARCHAR(255),
  	content TEXT,
  	pic_loc VARCHAR(255),
  	caption VARCHAR(255),
	PRIMARY KEY (id),
	FOREIGN KEY (page_id) 
        REFERENCES Pages (id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);