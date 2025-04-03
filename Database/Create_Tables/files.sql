CREATE TABLE files(
  id SERIAL, -- auto generated id
  lot_number VARCHAR(8) NOT NULL,
  lot_descriptor VARCHAR(255) NOT NULL,
  section VARCHAR(4) NOT NULL,
  file TEXT,

  FOREIGN KEY(lot_number, lot_descriptor, section) REFERENCES lot(lot_number, lot_descriptor, section) ON DELETE CASCADE,
  PRIMARY KEY(id)
);