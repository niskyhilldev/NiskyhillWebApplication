CREATE TABLE lot(
  lot_id SERIAL, -- auto incrimented id
  lot_number VARCHAR(8) NOT NULL,
  lot_descriptor VARCHAR(255) DEFAULT 'Entire',
  section VARCHAR(4) NOT NULL,
  lot_map TEXT, -- for encoded file
  lot_owner INT,

  FOREIGN KEY (section) REFERENCES section(section_name) ON DELETE CASCADE,
  FOREIGN KEY (lot_owner) REFERENCES person(person_id) ON DELETE CASCADE,
  PRIMARY KEY(lot_id) 
);




