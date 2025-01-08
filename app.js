const server = require('./server').createServer();

// Server setup
const PORT = process.env.PORT || 3000;

// Database setup
const User = require('./models/user');
const Task = require('./models/task');

User.createTable((err) => {
    if (err) {
        console.error('Erreur lors de la création de la table users:', err.message);
    } else {
        console.log('Table users prête.');
    }
});

Task.createTable((err) => {
    if (err) {
        console.error('Erreur lors de la création de la table tasks:', err.message);
    } else {
        console.log('Table tasks prête.');
    }
});


server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
