const fs = require('fs')
const chokidar = require('chokidar')
const assert = require('assert')
const crypto = require('crypto')
let mongo = require('./mongo')

const err_regex = /^2019.+(EMG.+|ALT.+|CRI.+|ERR.+)/gm

let get_today_ts = function() {
    return new Date().toDateString()
}

let md5_hash = function(str) {
    const md5 = crypto.createHash('md5')
    return md5.update(str).digest('hex')
}

let process_error = function(path, str) {
    let err_list = []
    while ((arr = err_regex.exec(str)) !== null) {
        err_list.push(arr)
    }
    for (let i = 0; i < err_list.length; i++) {
        let key = err_list[i][1]
        let msg
        if (err_list[i+1]) {
            msg = str.slice(err_list[i].index, err_list[i+1].index)
        } else {
            msg = str.slice(err_list[i].index)
        }
        let ts = get_today_ts()
        console.log('key = ', key, ts, path)
        mongo.update(md5_hash(key + ts + path), msg, path, ts, (notify) => {
            if (notify) {
                console.log('new error occur!!', msg)
            }
        })
    }
}

let start = function() {
    let file_last_pos = {}
    for (let i = 2; i < process.argv.length; i++) {
        let file_path = process.argv[i]
        let stats = fs.statSync(file_path)
        if (stats.isFile()) {
            file_last_pos[file_path] = stats.size
            console.log('===== init = ', file_path, stats.size)
            chokidar.watch(file_path).on('change', (path, stats) => {
                console.log('onchange', path)
                let old_pos = file_last_pos[path]
                file_last_pos[path] = stats.size
                if (stats.size < old_pos) {
                    old_pos = 0
                }
                let len = stats.size - old_pos
                console.log('len = ', len, old_pos, stats.size)
                fs.open(path, "r", (err, fd) => {
                    if (err) throw err
                    let buffer = Buffer.alloc(len)
                    fs.read(fd, buffer, 0, len, old_pos, (err, bytesRead, buffer) => {
                        if (err) throw err
                        process_error(path, buffer.slice(0, bytesRead).toString())
                    })

                })
            })
        }
    }
}

mongo.connect(() => {
    start()
})
