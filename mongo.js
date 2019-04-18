const assert = require('assert')
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'
const db_name = 'log_satistics'

var _db
module.exports = {
    connect: function(cb) {
        try {
            MongoClient.connect(url, { useNewUrlParser: true }, (err, mongo) => {
                assert.equal(null, err)
                _db = mongo.db(db_name)
                return cb()
            })
        } catch(err) {
            console.error(err)
        }
    },
    update: function(key, msg, file_path, ts, cb) {
        try {
            _db.collection('error_log').updateOne({key: key}, {$set: {msg: msg, file_path: file_path, date: ts}}, {upsert: true}, (err, r) => {
                console.log('r.matchedCount = ', key, r.matchedCount)
                cb(r.matchedCount <= 0)
            })
        } catch(err) {
            console.error(err)
        }
    }
}
