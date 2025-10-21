/*import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true

  const chat = global.db.data.chats[m.chat]

  const getPais = (numero) => {
    const paises = {
      "1": "🇺🇸 Estados Unidos", "34": "🇪🇸 España", "52": "🇲🇽 México",
      "54": "🇦🇷 Argentina", "55": "🇧🇷 Brasil", "56": "🇨🇱 Chile",
      "57": "🇨🇴 Colombia", "58": "🇻🇪 Venezuela", "591": "🇧🇴 Bolivia",
      "593": "🇪🇨 Ecuador", "595": "🇵🇾 Paraguay", "598": "🇺🇾 Uruguay",
      "502": "🇬🇹 Guatemala", "503": "🇸🇻 El Salvador", "504": "🇭🇳 Honduras",
      "505": "🇳🇮 Nicaragua", "506": "🇨🇷 Costa Rica", "507": "🇵🇦 Panamá",
      "51": "🇵🇪 Perú", "53": "🇨🇺 Cuba", "91": "🇮🇳 India"
    }
    for (let i = 1; i <= 3; i++) {
      const prefijo = numero.slice(0, i)
      if (paises[prefijo]) return paises[prefijo]
    }
    return "🌎 Desconocido"
  }

  const usuarioJid = m.messageStubParameters[0] || m.key.participant
  const numeroUsuario = usuarioJid.split('@')[0]
  const pais = getPais(numeroUsuario)

  const ppUrl = await conn.profilePictureUrl(usuarioJid, 'image')
    .catch(_ => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')

  const thumbBuffer = await fetch('https://files.catbox.moe/crdknj.jpg').then(res => res.buffer())

  const fkontak = {
    key: { participants: "0@s.whatsapp.net", remoteJid: "status@broadcast", fromMe: false, id: "Halo" },
    message: { locationMessage: { name: "MiyukiBot-MD 🌸", jpegThumbnail: thumbBuffer } },
    participant: "0@s.whatsapp.net"
  }

  const fechaObj = new Date()
  const hora = fechaObj.toLocaleTimeString('es-PE', { timeZone: 'America/Lima' })
  const fecha = fechaObj.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Lima' })
  const dia = fechaObj.toLocaleDateString('es-PE', { weekday: 'long', timeZone: 'America/Lima' })
  const groupSize = participants.length + ((m.messageStubType === 27) ? 1 : ((m.messageStubType === 28 || m.messageStubType === 32) ? -1 : 0))

  const fakeContext = {
    contextInfo: {
      isForwarded: true,
      mentionedJid: [usuarioJid],
      externalAdReply: {
        title: "MiyukiBot-MD",
        body: "By OmarGranda",
        mediaUrl: null,
        description: null,
        previewType: "PHOTO",
        thumbnailUrl: "https://files.catbox.moe/crdknj.jpg",
        sourceUrl: "https://whatsapp.com",
        mediaType: 1,
        renderLargerThumbnail: false
      }
    }
  }

  const welcomeMessage = `╔══════════════════╗  
     *ＢＩＥＮＶＥＮＩＤＯ／Ａ* 
╚══════════════════╝  

🌸 *Grupo:* ${groupMetadata.subject}  
👤 *Usuario:* @${numeroUsuario}
  
👥 *Miembros:* ${groupSize}  
📅 *Fecha:* ${dia}, ${fecha}  
🕒 *Hora:* ${hora}  
🌍 *País:* ${pais}  

📌 Usa _.menu_ para ver la lista de comandos.

> 𝘔𝘪𝘺𝘶𝘬𝘪𝘉𝘰𝘵-𝘔𝘋 | © 𝘗𝘰𝘸𝘦𝘳𝘦𝘥 𝘉𝘺 𝘖𝘮𝘢𝘳𝘎𝘳𝘢𝘯𝘥𝘢`

  const byeMessage = `
╔══════════════════╗  
                *ＡＤＩＯＳ* 
╚══════════════════╝  

🏷️ *Grupo:* ${groupMetadata.subject}  
🧸 *Usuario:* @${numeroUsuario}  

👥 *Miembros restantes:* ${groupSize}  
📅 *Fecha:* ${dia}, ${fecha}  
⏰ *Hora:* ${hora}  
🌎 *País:* ${pais}  

🍃 Esperamos verte pronto de nuevo 🌼  
  
> 𝘔𝘪𝘺𝘶𝘬𝘪𝘉𝘰𝘵-𝘔𝘋 | © 𝘗𝘰𝘸𝘦𝘳𝘦𝘥 𝘉𝘺 𝘖𝘮𝘢𝘳𝘎𝘳𝘢𝘯𝘥𝘢`

  if (chat?.welcome && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    await conn.sendMessage(m.chat, {
      image: { url: ppUrl },
      caption: welcomeMessage,
      ...fakeContext,
      footer: "☆ MiyukiBot-MD ☆",
      mentions: [usuarioJid]
    }, { quoted: fkontak })
  }

  if (chat?.welcome && (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE || m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE)) {
    await conn.sendMessage(m.chat, {
      image: { url: ppUrl },
      caption: byeMessage,
      ...fakeContext,
      footer: "☆ MiyukiBot-MD ☆",
      mentions: [usuarioJid]
    }, { quoted: fkontak })
  }
}*/



import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'
import PhoneNumber from 'awesome-phonenumber'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true
  const chat = global.db.data.chats[m.chat]
  if (!chat?.welcome) return true

  const usuarioJid = m.messageStubParameters?.[0] || m.key.participant
  if (!usuarioJid) return

  const numeroUsuario = usuarioJid.split('@')[0]
  const tagUser = `@${numeroUsuario}`
  const groupSize = participants.length

  const fechaActual = new Date()
  const opciones = { timeZone: 'America/Lima', hour12: false }
  const fecha = fechaActual.toLocaleDateString('es-PE', opciones)
  const hora = fechaActual.toLocaleTimeString('es-PE', opciones)
  const dia = fechaActual.toLocaleString('es-PE', { weekday: 'long', timeZone: 'America/Lima' })

  const userId = m.sender.split('@')[0]
  const phone = PhoneNumber('+' + userId)
  const codigoPais = phone.getRegionCode() || '🌐'
  const paises = {
    PE: 'Perú 🇵🇪',
    MX: 'México 🇲🇽',
    AR: 'Argentina 🇦🇷',
    CL: 'Chile 🇨🇱',
    CO: 'Colombia 🇨🇴',
    VE: 'Venezuela 🇻🇪',
    EC: 'Ecuador 🇪🇨',
    BO: 'Bolivia 🇧🇴',
    UY: 'Uruguay 🇺🇾',
    PY: 'Paraguay 🇵🇾',
    ES: 'España 🇪🇸',
    US: 'Estados Unidos 🇺🇸',
    BR: 'Brasil 🇧🇷'
  }
  const pais = paises[codigoPais] || 'Desconocido 🌐'

  const tipo =
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD
      ? 'WELCOME'
      : (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE ||
         m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE)
      ? 'GOODBYE'
      : null
  if (!tipo) return

  const avatarUsuario = await conn.profilePictureUrl(usuarioJid, 'image')
    .catch(() => 'https://i.ibb.co/1s8T3sY/48f7ce63c7aa.jpg')
  const fondo = 'https://files.catbox.moe/7cckvp.jpg'
  
  const urlapi = tipo === 'WELCOME'
    ? `https://api.siputzx.my.id/api/canvas/welcomev1?username=${encodeURIComponent(tagUser)}&guildName=${encodeURIComponent(groupMetadata.subject)}&memberCount=${groupSize}&avatar=${encodeURIComponent(avatarUsuario)}&background=${encodeURIComponent(fondo)}&quality=100`
    : `https://api.siputzx.my.id/api/canvas/goodbyev2?username=${encodeURIComponent(tagUser)}&guildName=${encodeURIComponent(groupMetadata.subject)}&memberCount=${groupSize}&avatar=${encodeURIComponent(avatarUsuario)}&background=${encodeURIComponent(fondo)}`

  const thumb = await fetch('https://files.catbox.moe/7sbozb.jpg').then(res => res.buffer())
  const fkontak = {
    key: { participants: "0@s.whatsapp.net", remoteJid: m.chat, fromMe: false, id: "Halo" },
    message: { locationMessage: { name: "🌸 𝙍𝙞𝙣 𝙄𝙩𝙤𝙨𝙝𝙞 ʙᴏᴛ 🌸", jpegThumbnail: thumb } },
    participant: "0@s.whatsapp.net"
  }

  const welcomeMessage = `
╔═══════════════════╗
       \`\`\`𝖡𝖨𝖤𝖭𝖵𝖤𝖭𝖨𝖣𝖮/𝖠\`\`\`
╚═══════════════════╝
╭────⋆ ╤╤╤ ✯ ╤╤╤ ⋆╯
│ 🌾 *Usuario:* ${tagUser}
│ 📚 *Grupo:* ${groupMetadata.subject}
│• | ✧︿︿ . . . .
│ 🎋 *Miembros:* ${groupSize}
│ 🍉 *Fecha:* ${dia}, ${fecha}, ${hora}
│ ☃️ *Lugar:* ${pais}
╰━━━⬣

> ✨ *${groupMetadata.desc?.slice(0, 120) || "Sin descripción."}*
> ૮₍｡˃ ᵕ ˂ ｡₎ა 💕 Usa *_#help_* para explorar comandos.`

  const byeMessage = `
╔═══════════════════╗
       \`\`\`HASTA PRONTO\`\`\`
╚═══════════════════╝
╭────⋆ ╤╤╤ ✯ ╤╤╤ ⋆╯
│ 🌾 *Usuario:* ${tagUser}
│ 📚 *Grupo:* ${groupMetadata.subject}
│• | ✧︿︿ . . . 
│ 🎋 *Miembros:* ${groupSize}
│ 🍉 *Fecha:* ${dia}, ${fecha}, ${hora}
│ ☃️ *Lugar:* ${pais}
╰━━━⬣

> 🌧️ *Esperamos verte de nuevo pronto.*
> 🍃 Usa *_#help_* si vuelves, estaremos aquí.`

  const caption = tipo === 'WELCOME' ? welcomeMessage : byeMessage
  
  const mensajeProducto = {
    product: {
      productImage: { url: urlapi },
      productId: '2452968910',
      title: tipo === 'WELCOME' ? '🌸 NUEVO MIEMBRO 🌸' : '🌧️ DESPEDIDA 🌧️',
      description: '',
      currencyCode: 'USD',
      priceAmount1000: '10',
      retailerId: 1677,
      url: '',
      productImageCount: 1
    },
    businessOwnerJid: usuarioJid,
    caption,
    footer: `🌸 𝙍𝙞𝙣 𝙄𝙩𝙤𝙨𝙝𝙞 ʙᴏᴛ 🌸`,
    headerType: 1,
    mentions: [usuarioJid]
  }

  await conn.sendMessage(m.chat, mensajeProducto, {
    quoted: fkontak,
    contextInfo: { mentionedJid: [usuarioJid] }
  })
}