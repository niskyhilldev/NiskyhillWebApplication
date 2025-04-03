CREATE TABLE owners(
  id SERIAL, -- auto incrimented id
  firstname VARCHAR(255),
  middlename VARCHAR(255),
  lastname VARCHAR(255),
  suffix VARCHAR(16),
  organization VARCHAR(255),
  lot_number VARCHAR(8) NOT NULL,
  lot_descriptor VARCHAR(255) NOT NULL,
  section VARCHAR(4) NOT NULL,
  

  CHECK (lastname IS NOT NULL OR organization IS NOT NULL),   -- Ensures at least one is non-null
  FOREIGN KEY(lot_number, lot_descriptor, section) REFERENCES lot(lot_number, lot_descriptor, section) ON DELETE CASCADE,
  PRIMARY KEY(id)
);
