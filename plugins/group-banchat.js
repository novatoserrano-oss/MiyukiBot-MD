// plugins/grupo-bot.js
let handler = async (m, { conn, args = [], usedPrefix = '.', command = 'bot', isAdmin, isOwner }) => {
  try {
    // Identificadores y flags robustos
    const chatId = m.chat || (m.key && m.key.remoteJid) || ''
    const sender = m.sender || (m.key && m.key.participant) || ''
    const isGroup = (typeof m.isGroup !== 'undefined') ? m.isGroup : (chatId.endsWith && chatId.endsWith('@g.us'))

    // DEBUG: ver en consola cada vez que se invoque
    console.log('[grupo-bot] invoked', { chatId, sender, args, isAdmin, isOwner, isGroup })

    // Asegurar existencia de DB
    if (!global.db) global.db = { data: { chats: {} } }
    if (!global.db.data) global.db.data = { chats: {} }
    if (!global.db.data.chats[chatId]) global.db.data.chats[chatId] = {}
    let chat = global.db.data.chats[chatId]

    if (typeof chat.isBanned === 'undefined') {
      chat.isBanned = false
      console.log('[grupo-bot] inicializando chat.isBanned = false para', chatId)
    }

    const bot = global.botname || 'MiyukiBot'
    const estadoActual = chat.isBanned ? '✗ Desactivado' : '✓ Activado'

    // Mostrar menú si no hay argumentos
    if (!args[0]) {
      const info = `
╭━━━〔 ⚙️ Control del Bot 〕━━⬣
┃ ✦ Solo *administradores* pueden usar:
┃
┃ 🟢 Activar » *${usedPrefix + command} on*
┃ 🔴 Desactivar » *${usedPrefix + command} off*
┃
┃ ✧ Estado actual » *${estadoActual}*
╰━━━━━━━━━━━━━━━━━━⬣`.trim()
      await conn.reply(chatId, info, m)
      return
    }

    const arg = args[0].toLowerCase()

    // Fallback para owner (si global.owner está definido)
    let _isOwner = Boolean(isOwner)
    if (!_isOwner && global.owner) {
      const owners = Array.isArray(global.owner) ? global.owner : [global.owner]
      _isOwner = owners.some(o => {
        if (!o) return false
        const jid = o.includes('@') ? o : `${o}@s.whatsapp.net`
        return jid === sender || (''+o).includes(sender)
      })
    }

    // Fallback para admin en caso de que isAdmin venga undefined
    let _isAdmin = typeof isAdmin === 'boolean' ? isAdmin : undefined
    if (typeof _isAdmin === 'undefined') {
      if (isGroup) {
        try {
          const metadata = await conn.groupMetadata(chatId)
          const participants = metadata?.participants || metadata?.members || []
          const user = participants.find(p => p.id === sender || p.jid === sender)
          _isAdmin = Boolean(user && (user.admin === 'admin' || user.admin === 'superadmin' || user.isAdmin || user.isSuperAdmin))
        } catch (e) {
          console.log('[grupo-bot] groupMetadata error (esto puede ocurrir si el bot no tiene permiso):', e && e.message)
          _isAdmin = false
        }
      } else {
        // si NO es grupo, lo permitimos (chat privado)
        _isAdmin = true
      }
    }

    console.log('[grupo-bot] permisos calculados', { _isAdmin, _isOwner })

    if (!_isAdmin && !_isOwner) {
      return conn.reply(chatId, '⚠️ Solo *administradores* pueden usar este comando.', m)
    }

    // Comandos on/off
    if (['off', 'disable', 'desactivar'].includes(arg)) {
      if (chat.isBanned) return conn.reply(chatId, `⚠️ *${bot}* ya estaba *desactivado.*`, m)
      chat.isBanned = true
      // intentar persistir si existe función write()
      try { if (global.db && typeof global.db.write === 'function') await global.db.write() } catch(e){console.log('[grupo-bot] db.write error', e)}
      return conn.reply(chatId, `🔒 Has *desactivado* a *${bot}* en este grupo.`, m)
    }

    if (['on', 'enable', 'activar'].includes(arg)) {
      if (!chat.isBanned) return conn.reply(chatId, `⚠️ *${bot}* ya estaba *activado.*`, m)
      chat.isBanned = false
      try { if (global.db && typeof global.db.write === 'function') await global.db.write() } catch(e){console.log('[grupo-bot] db.write error', e)}
      return conn.reply(chatId, `✅ Has *activado* a *${bot}* en este grupo.`, m)
    }

    return conn.reply(chatId, `❌ Opción no válida.\nUsa *${usedPrefix + command} on* o *${usedPrefix + command} off*`, m)
  } catch (err) {
    console.error('[grupo-bot] ERROR', err)
    try { await conn.reply(m.chat, '❌ Ocurrió un error interno. Revisa la consola del bot.', m) } catch(e){ console.log('[grupo-bot] no se pudo enviar mensaje de error', e) }
  }
}

handler.help = ['bot [on/off]']
handler.tags = ['grupo']
handler.command = /^bot$/i
handler.admin = true
handler.group = true

export default handler