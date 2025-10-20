import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true
  const chat = global.db.data.chats[m.chat]
  if (!chat?.welcome) return true

  const usuarioJid = m.messageStubParameters?.[0] || m.key.participant
  if (!usuarioJid) return

  const numeroUsuario = usuarioJid.split('@')[0]
  const tagUser = `@${numeroUsuario}`

  // Tipo de mensaje
  const tipo =
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD
      ? 'WELCOME'
      : (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE ||
         m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE)
      ? 'GOODBYE'
      : null
  if (!tipo) return

  const totalMembers = participants.length

  // Fecha formateada (ejemplo: "Hora 1:20 PM, lunes, 2 de septiembre 2025")
  const fechaObj = new Date()
  const hora = fechaObj.toLocaleTimeString('es-PE', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Lima' })
  const dia = fechaObj.toLocaleDateString('es-PE', { weekday: 'long', timeZone: 'America/Lima' })
  const fecha = fechaObj.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Lima' })
  const fechaFormateada = `Hora ${hora}, ${dia}, ${fecha}`

  const avatarUsuario = await conn.profilePictureUrl(usuarioJid, 'image')
    .catch(() => 'https://i.ibb.co/1s8T3sY/48f7ce63c7aa.jpg')

  const fondo = 'https://files.catbox.moe/7cckvp.jpg'

  // 🔥 APIs cambiadas (corrido igual que antes)
  const urlapi = tipo === 'WELCOME'
    ? `https://api.siputzx.my.id/api/canvas/welcomev1?username=${encodeURIComponent(tagUser)}&guildName=${encodeURIComponent(groupMetadata.subject)}&memberCount=${totalMembers}&avatar=${encodeURIComponent(avatarUsuario)}&background=${encodeURIComponent(fondo)}&quality=100`
    : `https://api.siputzx.my.id/api/canvas/goodbyev2?username=${encodeURIComponent(tagUser)}&guildName=${encodeURIComponent(groupMetadata.subject)}&memberCount=${totalMembers}&avatar=${encodeURIComponent(avatarUsuario)}&background=${encodeURIComponent(fondo)}`

  // Contacto falso con miniatura
  const thumb = await fetch('https://files.catbox.moe/7sbozb.jpg').then(res => res.buffer())
  const fkontak = {
    key: { participants: "0@s.whatsapp.net", remoteJid: m.chat, fromMe: false, id: "Halo" },
    message: { locationMessage: { name: "☆ 𝚁𝙸𝙽 𝙸𝚃𝙾𝚂𝙷𝙸 𝚄𝙻𝚃𝚁𝙰 ☆ 🌸", jpegThumbnail: thumb } },
    participant: "0@s.whatsapp.net"
  }

  // Texto decorado
  const caption = `
╔═══════════════════╗
      \`\`\`${tipo}\`\`\`
╚═══════════════════╝
╭────⋆ ╤╤╤ ✯ ╤╤╤ ⋆╯
│ 🌾 *Usuario:* ${tagUser}
│ 📚 *Grupo:* ${groupMetadata.subject}
│• | ✧︿︿ . . . .
│ 🎋 *Miembros:* ${totalMembers}
│ 🍉 *Fecha:* ${fechaFormateada}
╰━━━⬣

> 🍃 Usa *_#help_* para explorar comandos.
`.trim()

  // Botones personalizados
  const botones =
    tipo === 'WELCOME'
      ? [{ buttonId: '#verify', buttonText: { displayText: '🪄 Registrarse' }, type: 1 }]
      : [{ buttonId: '#menu', buttonText: { displayText: '📜 Menú' }, type: 1 }]

  // Mensaje tipo producto
  const mensajeProducto = {
    product: {
      productImage: { url: urlapi },
      productId: '2452968910',
      title: `${tipo} ✨`,
      description: '',
      currencyCode: 'USD',
      priceAmount1000: '10',
      retailerId: 1677,
      url: ``,
      productImageCount: 1
    },
    businessOwnerJid: usuarioJid,
    caption,
    footer: `🌸 𝙍𝙞𝙣 𝙄𝙩𝙤𝙨𝙝𝙞 𝘽𝙤𝙩`,
    buttons: botones,
    headerType: 1,
    mentions: [usuarioJid]
  }

  await conn.sendMessage(m.chat, mensajeProducto, {
    quoted: fkontak,
    contextInfo: { mentionedJid: [usuarioJid] }
  })
}