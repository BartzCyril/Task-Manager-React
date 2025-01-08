const sqlite3 = require('sqlite3').verbose();
const path = require('path')

let chemin = "";

if(process.env.NODE_ENV == 'test'){
    chemin = ":memory:"
}
else{
    chemin = path.join(__dirname, './tasks.sqlite')
}

// Connexion à la base de données SQLite
const db = new sqlite3.Database(chemin, (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données:', err.message);
    } else {
        console.log('Connexion à la base de données SQLite réussie.');
    }
});

module.exports = db
