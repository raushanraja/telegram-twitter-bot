const mongoose = require('mongoose')

const username = "raushanraja"
const password = "raushanrajapassword"
const server = "127.0.0.1:27017"
const database = "admin"
const uris=`mongodb://${username}:${password}@${server}/${database}`;
// console.log(uris);

class Database {
    constructor() {
        this._connect()
    }
    _connect() {
        mongoose.connect(`${uris}`, {useNewUrlParser: true})
            .then(()=>{console.log('Connection sussessful');
            })
            .catch((err) => {
                console.log('COnncetion Failed\nError:',err.errmsg);
                
            })
    }
}


module.exports = new Database()