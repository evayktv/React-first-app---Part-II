// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());


const users = {
  users_list: [
    {
      id: 'xyz789',
      name: 'Charlie',
      job: 'Janitor',
    },
    {
      id: 'abc123',
      name: 'Mac',
      job: 'Bouncer',
    },
    {
      id: 'ppp222',
      name: 'Mac',
      job: 'Professor',
    },
    {
      id: 'yat999',
      name: 'Dee',
      job: 'Aspiring actress',
    },
    {
      id: 'zap555',
      name: 'Dennis',
      job: 'Bartender',
    },
  ],
};

app.get('/', (req, res) => {
  res.send('Hello World!');
});



app.get('/users/:id', (req, res) => {
    const id = req.params['id']; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send('Resource not found.');
    } else {
        res.send(result);
    }
});

app.get('/users', (req, res) => {
    const { name, job } = req.query;
    
    if (name && job) {
        // Filter by both name and job
        let result = findUserByNameAndJob(name, job);
        result = { users_list: result };
        res.send(result);
    } else if (name) {
        // Filter only by name
        let result = findUserByName(name);
        result = { users_list: result };
        res.send(result);
    } else if (job) {
        // Filter only by job
        let result = findUserByJob(job);
        result = { users_list: result };
        res.send(result);
    } else {
        // No filters provided, return all users
        res.send(users);
    }
});

const findUserByName = (name) => { 
    return users['users_list']
        .filter( (user) => user['name'] === name); 
}

const findUserByJob = (job) => {
    return users['users_list']
        .filter((user) => user['job'] === job)
}

const findUserByNameAndJob = (name, job) => {
    return users['users_list']
        .filter((user) => user['name'] === name && user['job'] === job);
}

const findUserById = (id) =>
    users['users_list']
        .find( (user) => user['id'] === id);
  

const addUser = (user) => {
    user.id = randomId();
    // Rearrange the properties of the user object to place 'id' first
    const rearrangedUser = { id: user.id, ...user };

    users['users_list'].push(rearrangedUser);
    return user;
}

app.post('/users', (req, res) => {
    const userToAdd = req.body;
    const addedUser = addUser(userToAdd); // Add the user and get the updated representation
    res.status(201).json(addedUser); // Sending 201 code and the added user as a JSON response
  });
  


function randomId() {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    const idLength = 3; // based on the dataset
    let randomId = '';
    for (let i = 0; i < idLength; i++) { // get index
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters.charAt(randomIndex);
    }

    for (let i = 0; i < idLength; i++) { // get index
        const randomIndex = Math.floor(Math.random() * nums.length);
        randomId += nums.charAt(randomIndex);
    }
    return randomId;
}


const findIndexById = (userId) => {
    return users['users_list'].findIndex(user => user.id === userId);
}
app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    const index = findIndexById(id)

    if (index !== -1) {
        users['users_list'].splice(index, 1);
        res.status(204).send(); // Send a "No Content" response on successful deletion
    } else {
        res.status(404).send('User not found'); // User with the specified ID was not found
    }

});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


