CREATE TABLE resident(
  rid SERIAL NOT NULL,
  lot INTEGER NOT NULL ,
  firstname VARCHAR(255) NOT NULL,
  middlename VARCHAR(255),
  lastname VARCHAR(255) NOT NULL,
  death_date DATE,
  burial_date DATE,
  birth_date DATE,
  capsule VARCHAR(16),
  marker BOOLEAN,
  foundation BOOLEAN,
  viewable BOOLEAN DEFAULT TRUE, -- false if cannot be viewed by public 
  CHECK (LOWER(TRIM(capsule)) IN ('urn', 'casket')),  -- sets domain for capsule and makes sure we do not store whitespace or any upercase characters
  FOREIGN KEY (lot) REFERENCES lot(lid) ON DELETE CASCADE,
  PRIMARY KEY(rid)
);

