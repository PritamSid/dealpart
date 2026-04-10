-- Dealpart backend schema
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  accent TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  subtitle TEXT,
  price TEXT NOT NULL,
  icon TEXT,
  tone TEXT,
  category TEXT,
  stock INTEGER,
  stock_text TEXT,
  status TEXT,
  created_date TEXT,
  order_count INTEGER DEFAULT 0,
  is_top BOOLEAN DEFAULT 0,
  is_new BOOLEAN DEFAULT 0
);

CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id TEXT NOT NULL,
  name TEXT,
  order_date TEXT NOT NULL,
  status TEXT NOT NULL,
  amount REAL NOT NULL,
  method TEXT
);

CREATE TABLE IF NOT EXISTS country_sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  country TEXT NOT NULL,
  sales TEXT NOT NULL,
  change_pct TEXT NOT NULL,
  positive INTEGER NOT NULL,
  progress INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  order_count INTEGER DEFAULT 0,
  total_spend TEXT DEFAULT '$0',
  status TEXT DEFAULT 'Active'
);
