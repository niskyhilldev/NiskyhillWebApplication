CREATE TABLE person(
  person_id SERIAL, -- auto incrimented id
  firstname VARCHAR(255),
  middlename VARCHAR(255),
  lastname VARCHAR(255),
  organization VARCHAR(255),
  remarks TEXT, -- for encoded file

  CHECK (lastname IS NOT NULL OR organization IS NOT NULL),   -- Ensures at least one is non-null
  PRIMARY KEY(person_id)
);

