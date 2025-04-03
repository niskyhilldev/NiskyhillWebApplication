CREATE TABLE lot(
  lot_number VARCHAR(8) NOT NULL,
  lot_descriptor VARCHAR(255) DEFAULT 'entire',
  section VARCHAR(4) NOT NULL,


  FOREIGN KEY (section) REFERENCES section(section_name) ON DELETE CASCADE,
  PRIMARY KEY(lot_number, lot_descriptor, section) 
);




