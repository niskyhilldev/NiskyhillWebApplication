CREATE TABLE buried(
  id SERIAL, -- auto incrimented id
  firstname VARCHAR(255) NOT NULL,
  middlename VARCHAR(255),
  lastname VARCHAR(255) NOT NULL,
  suffix VARCHAR(16),
  age VARCHAR(16),
  death_date VARCHAR(255),
  capsule VARCHAR(16),
  marker BOOLEAN,
  foundation BOOLEAN,
  lot_number VARCHAR(8) NOT NULL,
  lot_descriptor VARCHAR(255) DEFAULT 'entire',
  section VARCHAR(4) NOT NULL,
  public BOOLEAN DEFAULT TRUE -- false if cannot be viewed by public 
  

  CHECK (LOWER(TRIM(capsule)) IN ('urn', 'casket')),  -- sets domain for capsule and makes sure we do not store whitespace or any upercase characters
  FOREIGN KEY(lot_number, lot_descriptor, section) REFERENCES lot(lot_number, lot_descriptor, section) ON DELETE CASCADE,
  PRIMARY KEY(id)
);

