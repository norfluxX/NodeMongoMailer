const express = require('express');
const https = require('https');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const basicAuth = require('basic-auth');
const app = express();
const port = process.env.PORT || 443;

const mongoUsername = 'admin';
const mongoPassword = 'admin';
const mongoUri = `mongodb://admin:admin@172.18.0.2:27017`;
const dbName = 'foo';
const collectionName = 'roger';

// Secret key for JWT (replace with a strong, secret key)
const jwtSecret = 'paraMountMinar404Gethahah.';

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views'));
app.set('view engine', 'html');

// Nodemailer configuration (replace with your email credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bhikeshkhute10.3@gmail.com', // replace with your Gmail address
    pass: 'hcsazqdrusqkqibp', // replace with your Gmail password or an app-specific password
  },
});

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.post('/add', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Connect to MongoDB
    const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    // Insert data into MongoDB
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    await collection.insertOne({ name, email, message });

    // Close MongoDB connection
    await client.close();

    // Send email
    const mailOptions = {
      from: '<origin_email>', // replace with your Gmail address
      to: `${email}`, // replace with the recipient's email address
      subject: 'New Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.redirect('/');
  } catch (error) {
    console.error('Error adding data to MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Middleware for basic authentication
const authenticate = (req, res, next) => {
  const credentials = basicAuth(req);

  if (!credentials){
    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
    res.status(401).send('Authentication required');
  } else if (credentials.name == 'chooseanything' && credentials.pass == 'literally'){
    next();
  } else {
    res.status(403).send('Authentication Failed!');
  }
};

// Route to fetch all details from MongoDB with authentication
app.get('/api/details', authenticate, async (req, res) => {
  try {
    const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const details = await collection.find().toArray();

    // Close MongoDB connection
    await client.close();

    res.json(details);
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

// HTTPS options
const httpsOptions = {
  key: fs.readFileSync('privkey1.pem'),
  cert: fs.readFileSync('fullchain1.pem'),
  ca: [
    fs.readFileSync('chain1.pem'),
    fs.readFileSync('cert1.pem')
  ]
};

// Start the HTTPS server
https.createServer(httpsOptions, app).listen(port, () => {
  console.log(`Server running at https://localhost:${port}/`);
});

