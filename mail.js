const nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
        user: 'rangercyh@qq.com',
        pass: 'svrkawmouwkvbgee',
    }
})

let mailOptions = {
    subject: '冒险岛master服务器报错',
    from: {
        name: '冒险岛机器人',
        address: 'rangercyh@qq.com',
    },
    to: '"蔡毅恒" <yihengcai@rastar.com>, "黄加祥" <jiaxianghuang@rastar.com>, "毛秋云" <qiuyunmao@rastar.com>, "刘书伟" <shuweiliu@rastar.com>',
    // to: '"蔡毅恒" <yihengcai@rastar.com>',
}

module.exports = function(path, content) {
    let text = '文件路径：' + path + '\n'
    text += '报错内容：\n' + content + '\n'
    mailOptions.html = text
    transporter.sendMail(mailOptions)
}
