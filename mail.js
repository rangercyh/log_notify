const nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
    host: 'stmp.xxxx.com',
    port: 465,
    secure: true,
    auth: {
        user: 'xxxx',
        pass: 'xxxx',
    }
})

let mailOptions = {
    subject: 'xxxx',
    from: {
        name: 'xxxx',
        address: 'xxxx@xxxx.com',
    },
    to: '"xxxx" <xxxx@xxxx.com>',
}

module.exports = function(path, content) {
    let text = '文件路径：' + path + '\n'
    text += '报错内容：\n' + content + '\n'
    mailOptions.html = text
    transporter.sendMail(mailOptions)
}
