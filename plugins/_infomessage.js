import { WAMessageStubType } from '@whiskeysockets/baileys'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

const groupMetadataCache = new Map()
const lidCache = new Map()

const handler = m => m
handler.before = async function (m, { conn, participants, groupMetadata }) {
  try {
    if (!m.messageStubType || !m.isGroup) return

    const chat = global.db.data.chats[m.chat]
    if (!chat || !chat.detect) return

    const primaryBot = chat.primaryBot
    if (primaryBot && conn.user.jid !== primaryBot) return

    const users = m.messageStubParameters?.[0]
    const usuario = await resolveLidToRealJid(m?.sender, conn, m?.chat)
    const groupAdmins = participants.filter(p => p.admin)

    const rcanal = {
      contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          serverMessageId: '',
          newsletterName: channelRD.name
        },
        externalAdReply: {
          title: "𐔌 . ⋮ ᗩ ᐯ I Տ O .ᐟ ֹ ₊ ꒱",
          body: textbot,
          previewType: "PHOTO",
          thumbnail: await (await fetch(icono)).buffer(),
          sourceUrl: redes,
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }
    
    const mensajes = {
      22: { text: `📸✨ ¡La foto del grupo fue actualizada!\n👤 Por: @${usuario.split('@')[0]} 💕`, tipo: 'image' },
      23: { text: `🔗🌈 ¡El enlace del grupo fue restablecido!\n👤 Por: @${usuario.split('@')[0]} 💖`, tipo: 'text' },
      25: { text: `🛠️🌟 Configuración modificada por @${usuario.split('@')[0]} 💫\n📝 Ahora ${m.messageStubParameters[0] == 'on' ? 'solo admins' : 'todos'} pueden configurar el grupo.`, tipo: 'text' },
      26: { text: `🔐🌟 El grupo ahora está ${m.messageStubParameters[0] == 'on' ? 'cerrado 🔒' : 'abierto 🔓'} por @${usuario.split('@')[0]} 💕`, tipo: 'text' },
      29: { text: `🛡️✨ ¡Felicidades! @${users?.split('@')[0]} ahora es admin.\n👑 Acción hecha por @${usuario.split('@')[0]} 💖`, tipo: 'text' },
      30: { text: `💔 @${users?.split('@')[0]} ya no es admin 😢\n👤 Por @${usuario.split('@')[0]} 💕`, tipo: 'text' }
    }

    const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/rhzk4.jpg'
    
    if (m.messageStubType == 2) {
      const uniqid = (m.isGroup ? m.chat : m.sender).split('@')[0]
      const sessionPath = './sessions'
      if (fs.existsSync(sessionPath)) {
        for (const file of await fs.promises.readdir(sessionPath)) {
          if (file.includes(uniqid)) {
            await fs.promises.unlink(path.join(sessionPath, file))
            console.log(`${chalk.yellow.bold('✎ Eliminado')} ${chalk.greenBright(file)} (Posible error "undefined" en chat)`)
          }
        }
      }
      return
    }

    if (mensajes[m.messageStubType]) {
      const data = mensajes[m.messageStubType]
      const mentioned = [usuario, users, ...groupAdmins.map(v => v.id)].filter(Boolean)
      rcanal.contextInfo.mentionedJid = mentioned

      if (data.tipo === 'image') {
        await this.sendMessage(m.chat, { image: { url: pp }, caption: data.text, ...rcanal }, { quoted: null })
      } else {
        await this.sendMessage(m.chat, { text: data.text, ...rcanal }, { quoted: null })
      }
    } else {
      console.log({
        messageStubType: m.messageStubType,
        messageStubParameters: m.messageStubParameters,
        type: WAMessageStubType[m.messageStubType]
      })
    }
  } catch (e) {
    console.error(chalk.redBright(`⚠️ Error en handler.before:\n${e.stack || e}`))
  }
}

export default handler

async function resolveLidToRealJid(lid, conn, groupChatId, maxRetries = 3, retryDelay = 60000) {
  const inputJid = lid?.toString?.() || ''
  if (!inputJid.endsWith('@lid') || !groupChatId?.endsWith('@g.us'))
    return inputJid.includes('@') ? inputJid : `${inputJid}@s.whatsapp.net`

  if (lidCache.has(inputJid)) return lidCache.get(inputJid)
  const lidToFind = inputJid.split('@')[0]

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const metadata = await conn?.groupMetadata(groupChatId)
      if (!metadata?.participants) throw new Error('No se obtuvieron participantes')

      for (const participant of metadata.participants) {
        const contactDetails = await conn?.onWhatsApp(participant.jid)
        const possibleLid = contactDetails?.[0]?.lid?.split('@')[0]
        if (possibleLid === lidToFind) {
          lidCache.set(inputJid, participant.jid)
          return participant.jid
        }
      }
      lidCache.set(inputJid, inputJid)
      return inputJid
    } catch (e) {
      if (attempt + 1 >= maxRetries) {
        lidCache.set(inputJid, inputJid)
        return inputJid
      }
      await new Promise(r => setTimeout(r, retryDelay))
    }
  }
  return inputJid
}