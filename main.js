const fs = require('fs')
const chokidar = require('chokidar')

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
                        console.log('change text = ', buffer.slice(0, bytesRead).toString())
                    })

                })
            })
        }
    }
}

start()
