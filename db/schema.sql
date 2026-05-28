CREATE TABLE IF NOT EXISTS User (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  instagram TEXT,
  phoneNumber TEXT
);

CREATE TABLE IF NOT EXISTS Appointment (
  id TEXT PRIMARY KEY,
  userId INTEGER,
  name TEXT,
  pronouns TEXT,
  instagram TEXT,
  email TEXT,
  tattooDescription TEXT,
  tattooPlacement TEXT,
  tattooSize TEXT,
  availability TEXT,
  miscellaneous TEXT,
  imageSrc TEXT,
  createdAt TEXT
);

CREATE TABLE IF NOT EXISTS Painting (
  key TEXT PRIMARY KEY,
  title TEXT,
  material TEXT,
  dimensions TEXT,
  rank INTEGER,
  year INTEGER,
  updatedAt TEXT
);

CREATE TABLE IF NOT EXISTS Tattoo (
  key TEXT PRIMARY KEY,
  name TEXT
);
