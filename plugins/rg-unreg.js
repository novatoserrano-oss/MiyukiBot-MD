let handler = async (m, { conn, text }) => {

let user = global.db.data.users[m.sender]

user.registered = false
return conn.reply(m.chat, `🚯 *Tu registro fue eliminado de mi base de datos*.

🌙🌸 𝐆𝐫𝐚𝐜𝐢𝐚𝐬 𝐩𝐨𝐫 𝐡𝐚𝐛𝐞𝐫 𝐬𝐢𝐝𝐨 𝐩𝐚𝐫𝐭𝐞 𝐝𝐞 𝐧𝐨𝐬𝐨𝐭𝐫𝐨𝐬.  
𝐄𝐬𝐩𝐞𝐫𝐚𝐦𝐨𝐬 𝐯𝐞𝐫𝐭𝐞 𝐧𝐮𝐞𝐯𝐚𝐦𝐞𝐧𝐭𝐞 💫
 
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📩 𝐏𝐚𝐫𝐚 𝐫𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐫𝐭𝐞 𝐝𝐞 𝐧𝐮𝐞𝐯𝐨 𝐮𝐭𝐢𝐥𝐢𝐳𝐚:  
📌 *.reg 𝐍𝐨𝐦𝐛𝐫𝐞. 𝐄𝐝𝐚𝐝*  
━━━━━━━━━━━━━━━`, m)

}
handler.help = ['unreg']
handler.tags = ['rg']
handler.command = ['unreg']
handler.register = true
export default handler
