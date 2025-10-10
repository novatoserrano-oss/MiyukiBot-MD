// handler (ajusta la firma según tu framework si hace falta)
let handler = async (m, { conn, args, usedPrefix, command }) => {
  // asegúrate de que exista el objeto chat en tu DB
  global.db = global.db || { data: { chats: {} } }
  const chatId = m.chat
  global.db.data.chats[chatId] = global.db.data.chats[chatId] || {}
  const chat = global.db.data.chats[chatId]

  if (typeof chat.isBanned === 'undefined') chat.isBanned = false

  // normalizamos el argumento (quita espacios y mayúsculas)
  const action = (args[0] || '').toString().toLowerCase().trim()

  if (!action) {
    const estado = chat.isBanned ? '✗ Desactivado' : '✓ Activado'
    const info = `「✦」Un administrador puede activar o desactivar a *${botname}* utilizando:\n\n✐ _Activar_ » *${usedPrefix}bot on* / *${usedPrefix}bot enable*\n✐ _Desactivar_ » *${usedPrefix}bot off* / *${usedPrefix}bot disable*\n\n✧ Estado actual » *${estado}*`
    return conn.reply(m.chat, info, m)
  }

  // aceptamos varios sinónimos
  if (['off', 'disable', 'desactivar'].includes(action)) {
    if (chat.isBanned) return conn.reply(m.chat, `《✦》${botname} ya estaba desactivado.`, m)
    chat.isBanned = true
    return conn.reply(m.chat, `❀ Has *desactivado* a ${botname}!`, m)
  } else if (['on', 'enable', 'activar'].includes(action)) {
    if (!chat.isBanned) return conn.reply(m.chat, `《✦》${botname} ya estaba activado.`, m)
    chat.isBanned = false
    return conn.reply(m.chat, `❀ Has *activado* a ${botname}!`, m)
  } else {
    return conn.reply(m.chat, `Uso: ${usedPrefix}bot on|off (también acepta enable/disable).`, m)
  }
}

handler.help = ['bot']
module.exports = handler