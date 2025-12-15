-- H2 database requires separate ALTER TABLE statements for each column
ALTER TABLE users ADD COLUMN email VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
ALTER TABLE users ADD COLUMN active BOOLEAN DEFAULT TRUE;