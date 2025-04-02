CREATE TABLE burried_at(
  person INT NOT NULL,
  burial_date DATE,
  birth_date DATE,
  death_date DATE,
  capsule VARCHAR(16),
  marker BOOLEAN DEFAULT FALSE,
  foundation BOOLEAN DEFAULT FALSE,
  lot_number VARCHAR(8) NOT NULL,
  lot_descriptor VARCHAR(255) NOT NULL,
  section VARCHAR(4) NOT NULL,
  

  CHECK (LOWER(TRIM(capsule)) IN ('urn', 'casket')),  -- sets domain for capsule and makes sure we do not store whitespace or any upercase characters
  FOREIGN KEY(person) REFERENCES person(person_id) ON DELETE CASCADE,
  FOREIGN KEY(lot_number, lot_descriptor, section) REFERENCES lot(lot_number, descriptor, section) ON DELETE CASCADE,
  PRIMARY KEY(person)
);

