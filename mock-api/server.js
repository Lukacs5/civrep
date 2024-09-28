const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5001;
const SECRET_KEY = 'asd234fasd'; // Cseréld le egy erősebb titkos kulcsra!

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock data
let users = [
  { id: 1, title: 'Mr.', lastName: 'Doe', firstName: 'John', middleName: 'X', gender: 'Male', maidenName: '', placeOfBirth: 'Budapest', dateOfBirth: '1980-01-01', citizenship: 'Hungarian', taxIdentificationNumber: '12345678901', loanEligibility: true },
  { id: 2, title: 'Ms.', lastName: 'Smith', firstName: 'Jane', middleName: 'A', gender: 'Female', maidenName: 'Doe', placeOfBirth: 'Debrecen', dateOfBirth: '1990-05-05', citizenship: 'Hungarian', taxIdentificationNumber: '23456789012', loanEligibility: true },
];

let workors = [];

// Funkció a kezdő felhasználó beállításához
const setupInitialUsers = async () => {
  const existingUser = workors.find(workor => workor.username === 'asd');
  
  if (!existingUser) {
    // Hash-eld a jelszót
    const hashedPassword = await bcrypt.hash('asd', 10);

    // Hozz létre egy új felhasználót
    const newWorkor = { id: 1, username: 'asd', password: hashedPassword };
    workors.push(newWorkor);
    
    console.log('Initial user created:', newWorkor);
  }
};

// API endpoints

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Get a user by ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('User not found');
  res.json(user);
});

// Create a new user
app.post('/api/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    ...req.body,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.post('/api/users/register', (req, res) => {
    const {
      title,
      lastName,
      firstName,
      middleName,
      gender,
      maidenName,
      placeOfBirth,
      dateOfBirth,
      citizenship,
      taxIdentificationNumber,
      loanEligibility,
    } = req.body;
  
    // Add the new user to the users array
    const newUser = {
      id: users.length + 1, // Incremental ID assignment
      title,
      lastName,
      firstName,
      middleName,
      gender,
      maidenName: gender === 'Nő' ? maidenName : '', 
      placeOfBirth,
      dateOfBirth,
      citizenship,
      taxIdentificationNumber,
      loanEligibility: loanEligibility
    };
  
    users.push(newUser);
  
    console.log(users);
    res.status(201).json(newUser); // res.status(201).json(newUser); .... 
  });

// Regisztráció
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  // Ellenőrizd, hogy a felhasználónév már létezik-e
  const existingUser = workors.find(workor => workor.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash-eld a jelszót
  const hashedPassword = await bcrypt.hash(password, 10);

  // Hozz létre egy új felhasználót
  const newWorkor = { id: workors.length + 1, username, password: hashedPassword };
  workors.push(newWorkor);

  res.status(201).json({ message: 'User registered successfully' });
});

// Bejelentkezés
app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Ellenőrizd, hogy létezik-e a workors adat
      const workor = workors.find(workor => workor.username === username);
      if (!workor) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Ellenőrizd a jelszót
      const isMatch = await bcrypt.compare(password, workor.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generálj egy JWT-t
      const token = jwt.sign({ username: workor.username }, SECRET_KEY, { expiresIn: '1h' });
  
      res.json({ token });
    } catch (error) {
      console.error("Hiba történt:", error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// Update a user
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('User not found');

  Object.assign(user, req.body);
  res.json(user);
});

// Delete a user
app.delete('/api/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) return res.status(404).send('User not found');

  users.splice(userIndex, 1);
  res.status(204).send();
});

// Indítsd el a kezdő felhasználó beállítását, mielőtt elindítanád a szervert
setupInitialUsers().then(() => {
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Error setting up initial users:', err);
});
