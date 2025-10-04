import { WAMessageStubType } from '@whiskeysockets/baileys'
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
    message: { locationMessage: { name: "☆ MiyukiBot-MD ☆ 🌸", jpegThumbnail: thumbBuffer } },
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
        title: "☆ MiyukiBot-MD ☆",
        body: dev,
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

  const welcomeMessage = `
┏ • 〇〇 • - • - • - • - • - ┓
🍓⏤͟͟͞͞ＶＩＥＮＶＥＮＩＤ＠⏤͟͟͞͞🍁
┗┳┳• - • - • - • - • ┳┳ ┛

✿ Bienvenid@ a *${groupMetadata.subject}*
♧ Usuario: @${numeroUsuario}
● ${groupMetadata.desc?.slice(0, 200) || "Sin descripción."}
❏ Ahora somos *${groupSize}* miembros
❍ Fecha: ${dia}, ${fecha}
❁ Hora: ${hora}
≡ País: ${pais}

> 🌸 Usa _#help_ para ver la lista de comandos.`

  const byeMessage = `
┏ • 〇〇 • - • - • - • - • - ┓
🍓⏤͟͟͞͞ＡＤＩＯＳ⏤͟͟͞͞🍁
┗┳┳• - • - • - • - • ┳┳ ┛

✿ Adiós de *${groupMetadata.subject}*
♧ Usuario: @${numeroUsuario}
❏ Miembros: ${groupSize}
❍ Fecha: ${dia}, ${fecha}
❁ Hora: ${hora}
≡ País: ${pais}

> 💔 Te esperamos pronto de regreso.
> 🌸 Usa _#help_ para ver la lista de comandos.`

  const welcomeApi = `https://api-nv.eliasaryt.pro/api/generate/welcome-image?username=${encodeURIComponent(numeroUsuario)}&guildName=${encodeURIComponent(groupMetadata.subject)}&memberCount=${groupSize}&avatar=${encodeURIComponent(ppUrl)}&background=https://i.ibb.co/4YBNyvP/images-76.jpg&guildIcon=${encodeURIComponent('https://github.com/OmarGranda.png')}&key=hYSK8YrJpKRc9jSE`

  const byeApi = `https://api-nv.eliasaryt.pro/api/generate/welcome-image?username=${encodeURIComponent(numeroUsuario)}&guildName=${encodeURIComponent(groupMetadata.subject)}&memberCount=${groupSize}&avatar=${encodeURIComponent(ppUrl)}&background=https://i.ibb.co/4YBNyvP/images-76.jpg&guildIcon=${encodeURIComponent('https://github.com/OmarGranda.png')}&key=hYSK8YrJpKRc9jSE`

  if (chat?.welcome && m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    await conn.sendMessage(m.chat, {
      image: { url: welcomeApi },
      caption: welcomeMessage,
      ...fakeContext,
      footer: "☆ MiyukiBot-MD ☆",
      mentions: [usuarioJid]
    }, { quoted: fkontak })
  }

  if (chat?.welcome && (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE || m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE)) {
    await conn.sendMessage(m.chat, {
      image: { url: byeApi },
      caption: byeMessage,
      ...fakeContext,
      footer: "☆ MiyukiBot-MD ☆",
      mentions: [usuarioJid]
    }, { quoted: fkontak })
  }
}