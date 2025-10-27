let handler = async (m, { conn }) => {
  let chat = global.db.data.chats[m.chat]
  if (!m.isGroup) return m.reply('Este comando solo puede usarse en grupos.')
  
  chat.primaryBot = conn.user.jid
  m.reply(`✅ *${conn.user.name}* ahora es el BOT PRINCIPAL de este grupo.`)
}

handler.help = ['setprimary']
handler.tags = ['owner', 'grupo']
handler.command = /^setprimary$/i
handler.group = true
handler.admin = true

export default handler