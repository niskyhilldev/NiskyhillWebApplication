CREATE TABLE users (
    uid SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL DEFAULT 'e641475e9275b30c3925d4c0a9810b606a29ae16f35ce666ccf2b847855c136d', -- default 'password'
    salt TEXT NOT NULL DEFAULT 'default_salt', -- default salt for hash above
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);

