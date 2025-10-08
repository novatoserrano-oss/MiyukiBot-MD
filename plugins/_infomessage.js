
// 📝 IMPORTACIONES Y CONSTANTES
// ===============================
import WAMessageStubType from (await import('@whiskeysockets/baileys')).default
import chalk from 'chalk'          // Para colores en consola
import fs from 'fs'                // Sistema de archivos
import path from 'path'            // Rutas
import fetch from 'node-fetch'     // Fetch para imágenes

// Cachés para optimización
const groupMetadataCache = new Map()
const lidCache = new Map()

// ===============================
// 🛠️ HANDLER PRINCIPAL
// ===============================
const handler = m => m

handler.before = async function (m, { conn, participants, groupMetadata }) {
  // 🚫 Validar si es mensaje de stub y grupo
  if (!m.messageStubType || !m.isGroup) return

  // 🔐 Verificar si es bot primario
  const primaryBot = global.db.data.chats[m.chat]?.primaryBot
  if (primaryBot && conn.user.jid !== primaryBot) throw false

  const chat = global.db.data.chats[m.chat]
  const users = m.messageStubParameters[0]
  const usuario = await resolveLidToRealJid(m?.sender, conn, m?.chat)
  const groupAdmins = participants.filter(p => p.admin)

  // ⚙️ Datos de ejemplo (personaliza aquí)
  const icono = 'https://images.unsplash.com/photo-1612831455549-2f8d8e5e8d2e' // Imagen
  const redes = 'https://example.com' // URL de redes
  const textbot = 'Texto del bot' // Texto del bot

  // 📸 Perfil del chat
  const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/av0kub.jpg'

  // 📝 Mensajes personalizados con emojis
  const mensajes = {
    nombre: `✨👤 @${usuario.split('@')[0]} ha cambiado el nombre del grupo.\n📝 Ahora el grupo se llama:\n*${m.messageStubParameters[0]}*`,
    foto: `🖼️📸 Se ha cambiado la foto del grupo.\n👤 Acción hecha por:\n@${usuario.split('@')[0]}`,
    edit: `⚙️🔧 @${usuario.split('@')[0]} ha configurado el grupo para que ${m.messageStubParameters[0] == 'on' ? 'solo admins' : 'todos'} puedan hacerlo.`,
    newlink: `🔗🔄 El enlace del grupo ha sido restablecido.\n👤 Acción por:\n@${usuario.split('@')[0]}`,
    status: `🔒🔓 El grupo ahora está ${m.messageStubParameters[0] == 'on' ? 'cerrado 🔐' : 'abierto 🔓'} por @${usuario.split('@')[0]}\n> Ahora ${m.messageStubParameters[0] == 'on' ? '*solo admins*' : '*todos*'} pueden enviar mensajes.`,
    admingp: `🛡️✅ @${users.split('@')[0]} ahora es admin del grupo.\n👤 Acción por:\n@${usuario.split('@')[0]}`,
    noadmingp: `🛡️❌ @${users.split('@')[0]} deja de ser admin del grupo.\n👤 Acción por:\n@${usuario.split('@')[0]}`
  }

  // 🔥 Limpieza de archivos si detecta
  if (chat.detect && m.messageStubType == 2) {
    const sessionPath = `./${sessions}/`
    for (const file of await fs.promises.readdir(sessionPath)) {
      if (file.includes((m.isGroup ? m.chat : m.sender).split('@')[0])) {
        await fs.promises.unlink(path.join(sessionPath, file))
        console.log(`${chalk.yellow.bold('✎')} ${chalk.greenBright(`'${file}'`)} - ${chalk.redBright('Archivo eliminado.')}`)
      }
    }
  }

  // 📩 Procesar tipos de stub
  if (chat.detect) {
    switch (m.messageStubType) {
      case 21: // Cambio de nombre
        rcanal.contextInfo.mentionedJid = [usuario, ...groupAdmins.map(v => v.id)]
        await this.sendMessage(m.chat, { text: mensajes.nombre, ...rcanal }, { quoted: null })
        break
      case 22: // Cambio de foto
        rcanal.contextInfo.mentionedJid = [usuario, ...groupAdmins.map(v => v.id)]
        await this.sendMessage(m.chat, { image: { url: pp }, caption: mensajes.foto, ...rcanal }, { quoted: null })
        break
      case 23: // Restablecer enlace
        rcanal.contextInfo.mentionedJid = [usuario, ...groupAdmins.map(v => v.id)]
        await this.sendMessage(m.chat, { text: mensajes.newlink, ...rcanal }, { quoted: null })
        break
      case 25: // Configuración
        rcanal.contextInfo.mentionedJid = [usuario, ...groupAdmins.map(v => v.id)]
        await this.sendMessage(m.chat, { text: mensajes.edit, ...rcanal }, { quoted: null })
        break
      case 26: // Estado del grupo
        rcanal.contextInfo.mentionedJid = [usuario, ...groupAdmins.map(v => v.id)]
        await this.sendMessage(m.chat, { text: mensajes.status, ...rcanal }, { quoted: null })
        break
      case 29: // Nuevo admin
        rcanal.contextInfo.mentionedJid = [usuario, users, ...groupAdmins.map(v => v.id)].filter(Boolean)
        await this.sendMessage(m.chat, { text: mensajes.admingp, ...rcanal }, { quoted: null })
        return
      case 30: // Quitar admin
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

// ===============================
// 🚀 EXPORTAR HANDLER
// ===============================
export default handler

// ===============================
// 🔍 RESOLVER LID a JID real
// ===============================
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
