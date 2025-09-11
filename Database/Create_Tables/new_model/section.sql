CREATE TABLE section(
  sid SERIAL NOT NULL,
  name VARCHAR(16) UNIQUE NOT NULL,
  map TEXT, -- for an encoded file
  PRIMARY KEY(sid),
  UNIQUE(name)
);


