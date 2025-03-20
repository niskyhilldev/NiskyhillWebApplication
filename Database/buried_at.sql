CREATE TABLE burried_at(
  person INT NOT NULL,
  burial_date DATE,
  birth_date DATE,
  death_date DATE,
  capsule VARCHAR(16) NOT NULL,

  CHECK (LOWER(TRIM(capsule)) IN ('urn', 'casket')),  -- sets domain for capsule and makes sure we do not store whitespace or any upercase characters
  FOREIGN KEY(person) REFERENCES person(person_id) ON DELETE CASCADE,
  PRIMARY KEY(person)
);

