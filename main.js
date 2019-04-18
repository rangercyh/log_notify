const fs = require('fs')
const Inotify = require('inotify').Inotify
let inotify = new Inotify()

let callback = function(event) {
    var mask = event.mask
    var type = mask & Inotify.IN_ISDIR ? 'directory' : 'file'
    if (event.name) {
        type += ' ' + event.name + ' '
    } else {
        type += ' '
    }
    if (mask & Inotify.IN_MODIFY) {
        console.log(type + 'modify!!')
    }
}

for (let i = 2; i < process.argv.length; i++) {
    console.log(process.argv[i])
    fs.stat(process.argv[i], (err, stats) => {
        if (err == 'undefined') {
            if (stats.isFile()) {
                console.log('watch file:', file_path)
                inotify.addWatch({
                    path: file_path,
                    watch_for: Inotify.IN_MODIFY,
                    callback: callback,
                })
            } else {
                console.error(file_path, 'is not a file path!!!')
            }
        } else {
            console.error(err)
        }
    })
}
