import fs from 'fs'

const handler = async (m, { conn, command, isOwner, usedPrefix, args, text }) => {
  const setting = global.db.data.settings[conn.user.jid] || {}

  if (!isOwner) return m.reply('⚠️ Solo mi *creador* puede usar este comando.')

  const estado = setting.antiPrivate ? '🟢 Activado' : '🔴 Desactivado'

  if (!args[0]) {
    return m.reply(`
🌙 *Uso correcto:*
> ${usedPrefix + command} on
> ${usedPrefix + command} off

📛 *Estado actual:* ${estado}
`)
  }

  const opcion = args[0].toLowerCase()

  if (opcion === 'on') {
    setting.antiPrivate = true
    m.reply('✅ El modo *Anti-Privado* fue activado correctamente.\nEl bot ignorará los mensajes privados.')
  } else if (opcion === 'off') {
    setting.antiPrivate = false
    m.reply('🚫 El modo *Anti-Privado* fue desactivado.\nEl bot responderá nuevamente en privados.')
  } else {
    m.reply('❌ Opción no válida. Usa "on" o "off".')
  }
}

handler.help = ['antiprivate on/off']
handler.tags = ['owner']
handler.command = /^antiprivate$/i
handler.rowner = true

export default handler

export async function before(m, { conn, isOwner, isROwner }) {
  if (m.isBaileys && m.fromMe) return !0
  if (m.isGroup) return !1
  if (!m.message) return !0

  if (
    m.text?.includes('PIEDRA') ||
    m.text?.includes('PAPEL') ||
    m.text?.includes('TIJERA') ||
    m.text?.includes('serbot') ||
    m.text?.includes('jadibot')
  ) return !0

  const bot = global.db.data.settings[conn.user.jid] || {}
  const chatId = m.chat

  if (chatId === '120363416409380841@newsletter') return !0

  if (bot.antiPrivate && !isOwner && !isROwner) {
    console.log(`📵 Mensaje privado de ${m.sender}`)
    return !0
  }

  return !1
}