CREATE TABLE IF NOT EXISTS Users (
    userID TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL, -- salty hashbrowns
    email TEXT UNIQUE NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    company TEXT,
    role INTEGER DEFAULT 0, -- default to "no-role" role
    location TEXT,
    FOREIGN KEY (location) REFERENCES Location(locationID),
    FOREIGN KEY (company) REFERENCES Company(companyID)
);

CREATE TABLE IF NOT EXISTS Company (
    companyID TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    address TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Location ( -- Refers
    locationID TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    company TEXT,
    isWarehouse INTEGER DEFAULT 0,
    FOREIGN KEY (company) REFERENCES Company(companyID)
);

CREATE TABLE IF NOT EXISTS Item (
    itemID TEXT PRIMARY KEY,
    itemName TEXT UNIQUE NOT NULL,
    itemBrand TEXT NOT NULL,
    catagory TEXT, -- Catagory of Item
    quantity INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS Inventory (
    invID TEXT PRIMARY KEY,  -- Name of Location
  	item TEXT,
    location TEXT,
    itemQuantity INTEGER DEFAULT 0,  -- How many of the item is there
    FOREIGN KEY (location) REFERENCES Location(locationID),
    FOREIGN KEY (item) REFERENCES Item(itemID)
);

CREATE TABLE IF NOT EXISTS Orders (
    orderID TEXT PRIMARY KEY,
    dateOrdered DATE NOT NULL,
    list TEXT,
    FOREIGN KEY (list) REFERENCES OrderLists(listID)
);

CREATE TABLE IF NOT EXISTS OrderLists (
    listID TEXT PRIMARY KEY,
    item TEXT,
    quantity INTEGER DEFAULT 0,
    FOREIGN KEY (item) REFERENCES Item(itemID)
);