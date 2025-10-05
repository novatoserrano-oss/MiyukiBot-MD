let handler = async (m, { conn, text }) => {

let user = global.db.data.users[m.sender]

user.registered = false
return conn.reply(m.chat, `🚯 *Tu registro fue borrado de mi base de datos*.
📩 𝐏𝐚𝐫𝐚 𝐫𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐫𝐭𝐞 𝐝𝐞 𝐧𝐮𝐞𝐯𝐨:  
🔸 *.reg 𝐍𝐨𝐦𝐛𝐫𝐞 𝐄𝐝𝐚𝐝*`, m)

}
handler.help = ['unreg']
handler.tags = ['rg']
handler.command = ['unreg']
handler.register = true
export default handler
