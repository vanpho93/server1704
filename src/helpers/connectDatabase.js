const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

function getDatabaseUri() {
    if (process.env.NODE_ENV === 'test') return 'mongodb://localhost/mean1704-test';
    if (process.env.NODE_ENV === 'production') return 'mlab-databse';
    return 'mongodb://localhost/mean1704';
}

mongoose.connect(getDatabaseUri(), { useMongoClient: true })
.then(() => console.log('Database connected'))
.catch(error => console.log('Cannot connect database', error));
