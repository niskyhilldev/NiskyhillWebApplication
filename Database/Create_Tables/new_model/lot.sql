CREATE TABLE lot(
  lid SERIAL NOT NULL,
  number VARCHAR(16) NOT NULL,
  owner VARCHAR(255),
  section INTEGER NOT NULL,
  descriptor VARCHAR(255), 
  FOREIGN KEY (section) REFERENCES section(sid) ON DELETE CASCADE,
  PRIMARY KEY(lid),
  UNIQUE (number, descriptor, section)  -- This enforces the uniqueness 
);




