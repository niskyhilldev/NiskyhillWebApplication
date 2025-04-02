CREATE TABLE lot(
  lot_number VARCHAR(8) NOT NULL,
  descriptor VARCHAR(255) DEFAULT 'entire',
  section VARCHAR(4) NOT NULL,
  intermiment_records TEXT, -- for encoded file
  lot_owner INT, 

  FOREIGN KEY (section) REFERENCES section(section_name) ON DELETE CASCADE,
  FOREIGN KEY (lot_owner) REFERENCES person(person_id) ON DELETE CASCADE,
  PRIMARY KEY(lot_number, descriptor, section) 
);




