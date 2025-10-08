
import WAMessageStubType from (await import('@whiskeysockets/baileys')).default
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

// Cachés
const groupMetadataCache = new Map()
const lidCache = new Map()

// Handler principal
const handler = m => m

handler.before = async function (m, { conn, participants, groupMetadata }) {
  // Validar si es mensaje de stub y grupo
  if (!m.messageStubType || !m.isGroup) return

  // Verificar bot primario
  const primaryBot = global.db.data.chats[m.chat]?.primaryBot
  if (primaryBot && conn.user.jid !== primaryBot) throw false

  const chat = global.db.data.chats[m.chat]
  const users = m.messageStubParameters[0]
  const usuario = await resolveLidToRealJid(m?.sender, conn, m?.chat)
  const groupAdmins = participants.filter(p => p.admin)

  // Datos de ejemplo
  const icono = 'https://images.unsplash.com/photo-1612831455549-2f8d8e5e8d2e' // Ejemplo de icono
  const redes = 'https://example.com' // URL de ejemplo para redes
  const textbot = 'Texto del bot' // Texto ejemplo

  // Preparamos la imagen del perfil
  const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/av0kub.jpg'

  // Mensajes personalizados
  const mensajes = {
    nombre: `> ❀ @${usuario.split('@')[0]} Ha cambiado el nombre del grupo.\n> ✦ Ahora el grupo se llama:\n> *${m.messageStubParameters[0]}*.`,
    foto: `> ❀ Se ha cambiado la imagen del grupo.\n> ✦ Acción hecha por:\n> » @${usuario.split('@')[0]}`,
    edit: `> ❀ @${usuario.split('@')[0]} Ha permitido que ${m.messageStubParameters[0] == 'on' ? 'solo admins' : 'todos'} puedan configurar el grupo.`,
    newlink: `> ❀ El enlace del grupo ha sido restablecido.\n> ✦ Acción hecha por:\n> » @${usuario.split('@')[0]}`,
    status: `> ❀ El grupo ha sido ${m.messageStubParameters[0] == 'on' ? '*cerrado*' : '*abierto*'} Por @${usuario.split('@')[0]}\n> ✦ Ahora ${m.messageStubParameters[0] == 'on' ? '*solo admins*' : '*todos*'} pueden enviar mensaje.`,
    admingp: `> ❀ @${users.split('@')[0]} Ahora es admin del grupo.\n> ✦ Acción hecha por:\n> » @${usuario.split('@')[0]}`,
    noadmingp: `> ❀ @${users.split('@')[0]} Deja de ser admin del grupo.\n> ✦ Acción hecha por:\n> » @${usuario.split('@')[0]}`
  }

  // Limpieza de archivos si detecta
  if (chat.detect && m.messageStubType == 2) {
    const sessionPath = `./${sessions}/`
    for (const file of await fs.promises.readdir(sessionPath)) {
      if (file.includes((m.isGroup ? m.chat : m.sender).split('@')[0])) {
        await fs.promises.unlink(path.join(sessionPath, file))
        console.log(`${chalk.yellow.bold('✎ Delete!')} ${chalk.greenBright(`'${file}'`)}\n${chalk.redBright('Que provoca el "undefined" en el chat.')}`)
      }
    }
  }

  // Procesar diferentes tipos de stub
  if (chat.detect) {
    switch (m.messageStubType) {
      case 21:
        // Cambio de nombre
        rcanal.contextInfo.mentionedJid = [usuario, ...groupAdmins.map(v => v.id)]
        await this.sendMessage(m.chat, { text: mensajes.nombre, ...rcanal }, { quoted: null })
        break
      case 22:
        // Cambio de foto
        rcanal.contextInfo.mentionedJid = [usuario, ...groupAdmins.map(v => v.id)]
        await this.sendMessage(m.chat, { image: { url: pp }, caption: mensajes.foto, ...rcanal }, { quoted: null })
        break
      case 23:
        // Restablecer enlace
        rcanal.contextInfo.mentionedJid = [usuario, ...groupAdmins.map(v => v.id)]
        await this.sendMessage(m.chat, { text: mensajes.newlink, ...rcanal }, { quoted: null })
        break
      case 25:
        // Configuración
        rcanal.contextInfo.mentionedJid = [usuario, ...groupAdmins.map(v => v.id)]
        await this.sendMessage(m.chat, { text: mensajes.edit, ...rcanal }, { quoted: null })
        break
      case 26:
        // Estado del grupo
        rcanal.contextInfo.mentionedJid = [usuario, ...groupAdmins.map(v => v.id)]
        await this.sendMessage(m.chat, { text: mensajes.status, ...rcanal }, { quoted: null })
        break
      case 29:
        // Nuevo admin
        rcanal.contextInfo.mentionedJid = [usuario, users, ...groupAdmins.map(v => v.id)].filter(Boolean)
        await this.sendMessage(m.chat, { text: mensajes.admingp, ...rcanal }, { quoted: null })
        return
      case 30:
        // Quitar admin
        rcanal.contextInfo.mentionedJid = [usuario, users, ...groupAdmins.map(v => v.id)].filter(Boolean)
        await this.sendMessage(m.chat, { text: mensajes.noadmingp, ...rcanal }, { quoted: null })
        break
      default:
        if (m.messageStubType == 2) return
        console.log({
          messageStubType: m.messageStubType,
          messageStubParameters: m.messageStubParameters,
          type: WAMessageStubType[m.messageStubType],
        })
    }
  }
}

// Exportación del handler
export default handler

// Función para resolver lid a jid real
async function resolveLidToRealJid(lid, conn, groupChatId, maxRetries = 3, retryDelay = 60000) {
  const inputJid = lid.toString()
  if (!inputJid.endsWith("@lid") || !groupChatId?.endsWith("@g.us")) {
    return inputJid.includes("@") ? inputJid : `${inputJid}@s.whatsapp.net`
  }
  if (lidCache.has(inputJid)) {
    return lidCache.get(inputJid)
  }

  const lidToFind = inputJid.split("@")[0]
  let attempts = 0

  while (attempts < maxRetries) {
    try {
      const metadata = await conn?.groupMetadata(groupChatId)
      if (!metadata?.participants) throw new Error("No se obtuvieron participantes")
      
      for (const participant of metadata.participants) {
        try {
          if (!participant?.jid) continue
          const contactDetails = await conn?.onWhatsApp(participant.jid)
          if (!contactDetails?.[0]?.lid) continue
          const possibleLid = contactDetails[0].lid.split("@")[0]
          if (possibleLid === lidToFind) {
            lidCache.set(inputJid, participant.jid)
            return participant.jid
          }
        } catch (e) {
          continue
        }
      }
      // No se encontró, cachear y retornar
      lidCache.set(inputJid, inputJid)
      return inputJid
    } catch (e) {
      if (++attempts >= maxRetries) {
        lidCache.set(inputJid, inputJid)
        return inputJid
      }
      await new Promise(resolve => setTimeout(resolve, retryDelay))
    }
  }
  return inputJid
}
