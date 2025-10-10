import fs from 'fs'

let handler = async (m, { conn, args, usedPrefix, command, isAdmin, isOwner }) => {
  let chat = global.db.data.chats[m.chat]
  const bot = global.botname || '🤖 MiyukiBot'

  // Asegurar que la propiedad exista
  if (typeof chat.isBanned === 'undefined') chat.isBanned = false

  const estadoActual = chat.isBanned ? '✗ Desactivado' : '✓ Activado'

  // Sin argumentos → mostrar menú
  if (!args[0]) {
    const info = `
╭━━━〔 ⚙️ *Control del Bot* 〕━━⬣
┃ ✦ Solo *administradores* pueden usar:
┃
┃ 🟢 Activar » *${usedPrefix + command} on*
┃ 🔴 Desactivar » *${usedPrefix + command} off*
┃
┃ ✧ Estado actual » *${estadoActual}*
╰━━━━━━━━━━━━━━━━━━⬣
`.trim()
    return conn.reply(m.chat, info, m)
  }

  // Normalizar argumento
  const arg = args[0].toLowerCase()

  // Verificar permisos
  if (!isAdmin && !isOwner) return conn.reply(m.chat, '⚠️ Solo *administradores* pueden usar este comando.', m)

  if (['off', 'disable', 'desactivar'].includes(arg)) {
    if (chat.isBanned) return conn.reply(m.chat, `⚠️ *${bot}* ya estaba *desactivado.*`, m)
    chat.isBanned = true
    return conn.reply(m.chat, `🔒 Has *desactivado* a *${bot}* en este grupo.`, m)
  }

  if (['on', 'enable', 'activar'].includes(arg)) {
    if (!chat.isBanned) return conn.reply(m.chat, `⚠️ *${bot}* ya estaba *activado.*`, m)
    chat.isBanned = false
    return conn.reply(m.chat, `✅ Has *activado* a *${bot}* en este grupo.`, m)
  }

  return conn.reply(m.chat, `❌ Opción no válida.\nUsa *${usedPrefix + command} on* o *${usedPrefix + command} off*`, m)
}

handler.help = ['bot [on/off]']
handler.tags = ['grupo']
handler.command = /^bot$/i
handler.admin = true
handler.group = true

export default handler