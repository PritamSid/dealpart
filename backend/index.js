const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(dbPath);

function initDatabase() {
  db.serialize(() => {
    const schemaSql = require('fs').readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    db.exec(schemaSql);

    db.get('SELECT COUNT(*) AS c FROM customers', (err, row) => {
      if (!row.c) {
        const categories = [
          ['Electronics', 'bi bi-cpu', 'mint'],
          ['Fashion', 'bi bi-handbag', 'peach'],
          ['Home', 'bi bi-house-heart', 'lavender'],
          ['Accessories', 'bi bi-smartwatch', 'sky'],
        ];
        categories.forEach(cat => db.run('INSERT INTO categories (name, icon, accent) VALUES (?, ?, ?)', cat));

        const products = [
          ['Smart Watch X2', 'Wearables', '$299', 'bi bi-smartwatch', 'mint', 'Electronics', 72, '72 in stock', 'In Stock', '2026-03-25', 154, 1, 1],
          ['Minimal Desk Lamp', 'Home', '$89', 'bi bi-lightbulb', 'peach', 'Home', 54, '54 in stock', 'In Stock', '2026-04-01', 120, 1, 1],
          ['Street Hoodie', 'Fashion', '$119', 'bi bi-stars', 'sky', 'Fashion', 38, '38 in stock', 'Low Stock', '2026-03-28', 102, 1, 1],
          ['Noise Cancel Headset', 'Electronic', '$220', 'bi bi-headphones', 'mint', 'Electronics', 14, '14 in stock', 'Low Stock', '2026-03-20', 85, 0, 1],
          ['Layered Linen Shirt', 'Fashion', '$68', 'bi bi-person-badge', 'sky', 'Fashion', 22, '22 in stock', 'In Stock', '2026-03-22', 63, 0, 1],
          ['Nordic Coffee Set', 'Home', '$94', 'bi bi-cup-hot', 'peach', 'Home', 8, '8 in stock', 'Low Stock', '2026-03-26', 58, 0, 1],
          ['Canvas Backpack', 'Accessories', '$74', 'bi bi-bag', 'mint', 'Accessories', 0, '0 in stock', 'Out of Stock', '2026-03-15', 918, 0, 0],
          ['Bluetooth Speaker Mini', 'Electronics', '$96', 'bi bi-speaker', 'sky', 'Electronics', 0, '0 in stock', 'Out of Stock', '2026-03-15', 684, 0, 0],
          ['Wireless Earbuds Pro', 'Electronics', '$129', 'bi bi-earbuds', 'mint', 'Electronics', 1, '1 in stock', 'Stock', '2026-03-16', 1245, 0, 0],
          ['Coffee Maker', 'Home', '$140', 'bi bi-cup-hot', 'lavender', 'Home', 35, '35 in stock', 'In Stock', '2026-03-27', 80, 0, 0]
        ];
        products.forEach(p => db.run('INSERT INTO products (name, subtitle, price, icon, tone, category, stock, stock_text, status, created_date, order_count, is_top, is_new) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', p));

        const seedCustomers = [
          ['CUST-1101', 'John Doe', 'john.doe@dealpart.demo', '+1 (555) 102-4411', 25, '$3,450', 'Active'],
          ['CUST-1102', 'Jane Smith', 'jane.smith@dealpart.demo', '+1 (555) 304-2208', 5, '$250', 'Inactive'],
          ['CUST-1103', 'Emily Davis', 'emily.davis@dealpart.demo', '+1 (555) 778-1990', 30, '$4,600', 'VIP'],
          ['CUST-1104', 'Michael Brown', 'michael.brown@dealpart.demo', '+1 (555) 411-8922', 18, '$2,180', 'Active'],
          ['CUST-1105', 'Sophia Turner', 'sophia.turner@dealpart.demo', '+1 (555) 965-3014', 11, '$1,190', 'VIP'],
          ['CUST-1106', 'Liam Wilson', 'liam.wilson@dealpart.demo', '+1 (555) 872-1164', 9, '$780', 'Inactive'],
        ];
        seedCustomers.forEach(c => db.run('INSERT INTO customers (customer_id, name, email, phone, order_count, total_spend, status) VALUES (?, ?, ?, ?, ?, ?, ?)', c));

        const txs = [
          ['CUST-10234', 'John Doe', '2026-03-31', 'Paid', 1240.0, 'CC'],
          ['CUST-10235', 'Anna Smith', '2026-03-30', 'Pending', 840.0, 'PayPal'],
          ['CUST-10236', 'Will Brown', '2026-03-30', 'Paid', 2150.0, 'Bank'],
          ['CUST-10237', 'Emma Lee', '2026-03-29', 'Pending', 410.0, 'CC'],
          ['CUST-10238', 'Mohamed Ali', '2026-03-29', 'Paid', 1090.0, 'PayPal'],
          ['CUST-10239', 'Aaron Clark', '2026-03-28', 'Canceled', 53.0, 'Bank'],
          ['CUST-10240', 'Mia White', '2026-03-28', 'Paid', 780.0, 'CC']
        ];
        txs.forEach(tx => db.run('INSERT INTO transactions (customer_id, name, order_date, status, amount, method) VALUES (?, ?, ?, ?, ?, ?)', tx));

        db.run('INSERT INTO country_sales (country, sales, change_pct, positive, progress) VALUES (?, ?, ?, ?, ?)', ['USA', '$98.5K', '+12.8%', 1, 84]);
        db.run('INSERT INTO country_sales (country, sales, change_pct, positive, progress) VALUES (?, ?, ?, ?, ?)', ['Brazil', '$74.2K', '+8.3%', 1, 67]);
        db.run('INSERT INTO country_sales (country, sales, change_pct, positive, progress) VALUES (?, ?, ?, ?, ?)', ['Australia', '$61.9K', '-3.2%', 0, 53]);
      }
    });
  });
}

initDatabase();

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

async function toDashboardFormat() {
  const totalSalesRow = await dbGet('SELECT SUM(amount) AS total FROM transactions');
  const totalSales = totalSalesRow ? totalSalesRow.total || 0 : 0;

  const totalOrdersRow = await dbGet('SELECT COUNT(*) AS total FROM transactions');
  const totalOrders = totalOrdersRow ? totalOrdersRow.total || 0 : 0;

  const pendingRow = await dbGet("SELECT COUNT(*) AS total FROM transactions WHERE status = 'Pending'");
  const pending = pendingRow ? pendingRow.total || 0 : 0;

  const canceledRow = await dbGet("SELECT COUNT(*) AS total FROM transactions WHERE status = 'Canceled'");
  const canceled = canceledRow ? canceledRow.total || 0 : 0;

  const activeMonthSales = totalSales * 0.9;

  const totalProductsRow = await dbGet('SELECT COUNT(*) AS total FROM products');
  const totalProducts = totalProductsRow ? totalProductsRow.total : 0;

  const stockProductsRow = await dbGet('SELECT COUNT(*) AS count FROM products WHERE stock > 0');
  const stockProducts = stockProductsRow ? stockProductsRow.count : 0;

  const outOfStockRow = await dbGet('SELECT COUNT(*) AS count FROM products WHERE stock = 0');
  const outOfStock = outOfStockRow ? outOfStockRow.count : 0;

  const weeklyMetrics = [
    { label: 'Customers', value: '52k' },
    { label: 'Total Products', value: `${totalProducts}k` },
    { label: 'Stock Products', value: `${stockProducts}k` },
    { label: 'Out of Stock', value: `${outOfStock}k` },
    { label: 'Revenue', value: asCurrency(totalSales) },
  ];

  const statsCards = [
    { title: 'Total Sales', value: asCurrency(totalSales), change: '+10.4%', meta: 'from last month', icon: 'bi bi-currency-dollar', tone: 'success' },
    { title: 'Total Orders', value: `${totalOrders}k`, change: '+14.4%', meta: 'new orders this week', icon: 'bi bi-bag-check', tone: 'primary' },
    { title: 'Pending', value: `${pending} users`, change: '+2.1%', meta: 'awaiting fulfillment', icon: 'bi bi-hourglass-split', tone: 'warning' },
    { title: 'Canceled', value: `${canceled}`, change: '-14.4%', meta: 'better than last week', icon: 'bi bi-x-circle', tone: 'danger' }
  ];

  const topProducts = await dbAll('SELECT name, subtitle, price, icon, tone FROM products WHERE is_top = 1 LIMIT 3');
  const bestSellingRows = await dbAll('SELECT name, order_count, status, price FROM products ORDER BY order_count DESC LIMIT 3');
  const bestSelling = bestSellingRows.map((p) => ({ name: p.name, totalOrders: `${p.order_count}`, status: p.status || 'Stock', price: p.price }));
  const categoriesRows = await dbAll('SELECT name, COUNT(*) AS total FROM products GROUP BY category');
  const categories = categoriesRows.map((p) => ({ name: p.name, total: `${p.total} items` }));
  const newProducts = await dbAll('SELECT name, category, price, stock_text AS stock, icon, tone FROM products WHERE is_new = 1 LIMIT 3');

  const transactions = await dbAll('SELECT id AS no, customer_id AS customerId, order_date AS orderDate, status, "$" || amount AS amount FROM transactions ORDER BY id DESC LIMIT 5');

  const countrySales = await dbAll('SELECT country, sales, change_pct AS change, positive, progress FROM country_sales ORDER BY id ASC');

  return {
    statsCards,
    weeklyMetrics,
    weeklySeries: [22, 28, 24, 35, 31, 42, 38],
    activityUsers: '21.5K',
    activityBars: [6, 10, 8, 14, 12, 18, 15, 21, 16, 19],
    countrySales,
    transactions,
    topProducts,
    bestSelling,
    categories,
    newProducts,
  };
}

function asCurrency(value) {
  return `$${Math.round(value).toLocaleString()}`;
}

app.get('/api/dashboard', async (req, res) => {
  try {
    const data = await toDashboardFormat();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const tab = req.query.tab;
    let condition = '';
    if (tab === 'featured') condition = "WHERE status = 'In Stock'";
    else if (tab === 'sale') condition = "WHERE status = 'Low Stock'";
    else if (tab === 'out-of-stock') condition = "WHERE stock = 0";
    const rows = await dbAll(`SELECT id AS no, name, created_date AS createdDate, order_count AS orderCount, icon, status, category FROM products ${condition} ORDER BY id ASC`);
    const products = rows.map((p) => ({ ...p, icon: p.icon || 'bi bi-box-seam', tab: tab || 'all' }));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const categories = await dbAll('SELECT name, icon, accent FROM categories ORDER BY id ASC');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const status = req.query.status;
    let query = 'SELECT id, customer_id AS customerId, name, order_date AS date, "$" || amount AS total, method, status FROM transactions';
    const params = [];
    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status.charAt(0).toUpperCase() + status.slice(1));
    }
    query += ' ORDER BY id DESC';
    const rows = await dbAll(query, params);
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const perPage = 10;
    const start = (page - 1) * perPage;
    const paged = rows.slice(start, start + perPage);
    const totalRevenue = rows.reduce((acc, tx) => acc + parseFloat(tx.total.replace('$', '').replace(/,/g, '')), 0);
    res.json({
      summary: {
        totalRevenue: asCurrency(totalRevenue),
        completedTransactions: rows.filter((tx) => tx.status === 'Paid').length,
        pendingTransactions: rows.filter((tx) => tx.status === 'Pending').length,
        failedTransactions: rows.filter((tx) => tx.status === 'Canceled').length,
      },
      transactions: paged,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(rows.length / perPage),
        totalItems: rows.length,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = [
      { no: 1, orderNo: 'ORD-10231', customer: 'Sophia Lee', date: '31 Mar 2026', status: 'Paid', payment: 'Card', amount: '$1,240' },
      { no: 2, orderNo: 'ORD-10232', customer: 'Mason Clark', date: '31 Mar 2026', status: 'Pending', payment: 'PayPal', amount: '$320' },
      { no: 3, orderNo: 'ORD-10233', customer: 'Olivia Smith', date: '30 Mar 2026', status: 'Shipped', payment: 'Card', amount: '$980' },
      { no: 4, orderNo: 'ORD-10234', customer: 'Noah Patel', date: '30 Mar 2026', status: 'Paid', payment: 'Bank', amount: '$2,150' },
      { no: 5, orderNo: 'ORD-10235', customer: 'Emma Wilson', date: '29 Mar 2026', status: 'Canceled', payment: 'Card', amount: '$410' },
      { no: 6, orderNo: 'ORD-10236', customer: 'Liam Brown', date: '29 Mar 2026', status: 'Pending', payment: 'PayPal', amount: '$640' },
      { no: 7, orderNo: 'ORD-10237', customer: 'Ava Johnson', date: '28 Mar 2026', status: 'Shipped', payment: 'Card', amount: '$860' },
      { no: 8, orderNo: 'ORD-10238', customer: 'James Taylor', date: '28 Mar 2026', status: 'Paid', payment: 'Bank', amount: '$1,340' },
    ];
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, subtitle, price, icon, tone, category, stock, stock_text, status, created_date, order_count, is_top, is_new } = req.body;
    await dbRun('INSERT INTO products (name, subtitle, price, icon, tone, category, stock, stock_text, status, created_date, order_count, is_top, is_new) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, subtitle, price, icon, tone, category, stock, stock_text, status, created_date, order_count, is_top, is_new]);
    res.json({ message: 'Product added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Customer endpoints
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await dbAll('SELECT customer_id AS customerId, name, email, phone, order_count AS orderCount, total_spend AS totalSpend, status FROM customers ORDER BY id ASC');
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/customers/:id', async (req, res) => {
  try {
    const customer = await dbGet('SELECT customer_id AS customerId, name, email, phone, order_count AS orderCount, total_spend AS totalSpend, status FROM customers WHERE customer_id = ?', [req.params.id]);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { name, email, phone, status } = req.body;
    const customerId = 'CUST-' + (1100 + Math.floor(Math.random() * 9000));
    await dbRun('INSERT INTO customers (customer_id, name, email, phone, order_count, total_spend, status) VALUES (?, ?, ?, ?, ?, ?, ?)', [customerId, name, email, phone, 0, '$0', status || 'Active']);
    const newCustomer = await dbGet('SELECT customer_id AS customerId, name, email, phone, order_count AS orderCount, total_spend AS totalSpend, status FROM customers WHERE customer_id = ?', [customerId]);
    res.json(newCustomer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/customers/:id', async (req, res) => {
  try {
    const { name, email, phone, status } = req.body;
    await dbRun('UPDATE customers SET name = ?, email = ?, phone = ?, status = ? WHERE customer_id = ?', [name, email, phone, status, req.params.id]);
    const customer = await dbGet('SELECT customer_id AS customerId, name, email, phone, order_count AS orderCount, total_spend AS totalSpend, status FROM customers WHERE customer_id = ?', [req.params.id]);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/customers/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM customers WHERE customer_id = ?', [req.params.id]);
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Dealpart API server is running at http://localhost:${PORT}`);
});
