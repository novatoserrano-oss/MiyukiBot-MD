import { WAMessageStubType } from '@whiskeysockets/baileys'
import PhoneNumber from 'awesome-phonenumber'
import chalk from 'chalk'
import boxen from 'boxen'
import gradient from 'gradient-string'
import { watchFile } from 'fs'
import { fileURLToPath } from 'url'
import '../config.js'

async function safeGetName(conn, jid) {
  if (!jid || !conn) return jid ? jid.split('@')[0] : ''
  
  try {
    if (typeof conn.getName === 'function') {
      try {
        const n = conn.getName(jid)
        return typeof n?.then === 'function' ? await n : n
      } catch (e) {
        console.error('Error in conn.getName:', e)
      }
    }
    
    if (conn.contacts && typeof conn.contacts === 'object' && jid in conn.contacts) {
      const c = conn.contacts[jid]
      if (c) return c.name || c.notify || c.vname || c.short || c.verifiedName || ''
    }
    
    if (jid.endsWith('@g.us') && typeof conn.groupMetadata === 'function') {
      try { 
        const md = await conn.groupMetadata(jid)
        if (md?.subject) return md.subject 
      } catch (e) {
        console.error('Error getting group metadata:', e)
      }
    }
    
    return jid.split('@')[0]
  } catch (e) { 
    console.error('Error in safeGetName:', e)
    return jid.split('@')[0] 
  }
}

const terminalImage = global.opts?.img ? (await import('terminal-image')).default : null
const urlRegex = (await import('url-regex-safe')).default({ strict: false })
const mid = { idioma_code: 'es' }

export default async function (m, conn = { user: {} }) {
  if (!m) {
    console.error('Message object is undefined')
    return
  }

  const now = new Date()
  const dateStr = now.toLocaleDateString('es-ES')
  const timeStr = now.toLocaleTimeString('it-IT', { hour12: false }).slice(0, 8)
  const hour = now.getHours()
  const dayIcon = hour < 6 ? '🌙' : hour < 12 ? '☀️' : hour < 18 ? '🌤️' : '🌙'

  const senderJid = m?.sender || m?.key?.participant || m?.participant || m?.key?.remoteJid || ''
  const chatId = m?.chat || m?.key?.remoteJid || senderJid

  const _name = (await safeGetName(conn, senderJid)) || m?.pushName || 'Anónimo'
  let senderNum = ''
  if (senderJid) {
    try { 
      senderNum = PhoneNumber('+' + senderJid.replace(/:@.+/, '').replace('@s.whatsapp.net', '')).getNumber('international') 
    } catch { 
      try { 
        senderNum = senderJid.split('@')[0] 
      } catch { 
        senderNum = senderJid || 'desconocido' 
      } 
    }
  }
  const sender = (senderNum || senderJid || 'desconocido') + (_name ? ` ~${_name}` : '')
  const chat = await safeGetName(conn, chatId)
  
  const user = (global.db?.data?.users && senderJid) ? global.db.data.users[senderJid] : undefined
  
  let me = ''
  try { 
    if (conn?.user?.jid) {
      me = PhoneNumber('+' + conn.user.jid.replace('@s.whatsapp.net', '')).getNumber('international') 
    }
  } catch { 
    me = conn?.user?.jid?.split?.('@')[0] || 'Bot' 
  }

  const typeRaw = m.mtype || 'Unknown'
  const grad = gradient(['#ff5f6d', '#ffc371'])
  const stamp = grad(`${dayIcon} ${dateStr} ${timeStr}`)

  let filesize = 0
  if (m.msg) {
    if (m.msg.vcard) {
      filesize = m.msg.vcard.length || 0
    } else if (m.msg.fileLength) {
      filesize = m.msg.fileLength.low || m.msg.fileLength || 0
    } else if (m.msg.axolotlSenderKeyDistributionMessage) {
      filesize = m.msg.axolotlSenderKeyDistributionMessage.length || 0
    }
  } else if (m.text) {
    filesize = m.text.length || 0
  }

  const lines = [
    `${chalk.cyan('❯')} ${chalk.white.bold('Bot:')} ${chalk.cyan(me + (conn.user.name ? ` ~${conn.user.name}` : '') + (conn.user.jid == global.conn?.user?.jid ? '' : ' 【𝗦𝗨𝗕 𝗕𝗢𝗧】'))}`,
    `${chalk.cyan('❯')} ${chalk.white.bold('ID:')} ${chalk.yellow(senderJid || 'N/A')}`,
    `${chalk.cyan('❯')} ${chalk.white.bold('Usuario:')} ${chalk.yellow(sender)} / ${chalk.magentaBright.bold(user?.role?.replace(/\*/g, '') || 'N/A')}`,
    `${chalk.cyan('❯')} ${chalk.white.bold('Premium:')} ${user?.premiumTime > 0 ? '✅' : '❌'}`,
    `${chalk.cyan('❯')} ${chalk.white.bold('Recursos:')} 🆙 ${user?.level || 0} ❇️ ${user?.exp || 0} 💎 ${user?.limit || 0} 🐱 ${user?.money || 0}`,
    (chatId || '').includes('@s.whatsapp.net') ? `${chalk.cyan('❯')} ${chalk.white.bold('Chat:')} ${chalk.greenBright('Privado')} ${chalk.dim(`con ${_name}`)}` : (chatId || '').includes('@g.us') ? `${chalk.cyan('❯')} ${chalk.white.bold('Chat:')} ${chalk.magentaBright('Grupo')} ${chalk.dim(`${chat}`)}` : (chatId || '').includes('@newsletter') ? `${chalk.cyan('❯')} ${chalk.white.bold('Chat:')} ${chalk.yellowBright('Canal')} ${chalk.dim(`${chat}`)}` : '',
    `${chalk.cyan('❯')} ${chalk.white.bold('Tipo:')} ${chalk.bgBlueBright.bold(mid.idioma_code === 'es' ? await formatMessageTypes(m.mtype) : await formaTxt(m.mtype))}`,
    `${chalk.cyan('❯')} ${chalk.white.bold('Tamaño:')} ${chalk.red(filesize + ' B')}`
  ].filter(Boolean)

  const logBuffer = []
  logBuffer.push(boxen(lines.join('\n'), { 
    title: stamp, 
    titleAlignment: 'center', 
    padding: 1, 
    margin: 1, 
    borderStyle: 'round', 
    borderColor: 'cyan', 
    float: 'center' 
  }))
  
  setImmediate(() => { 
    console.log(logBuffer.join('\n')); 
    logBuffer.length = 0 
  })

  let img
  try { 
    if (global.opts?.img && terminalImage && /sticker|image/gi.test(m.mtype)) {
      img = await terminalImage.buffer(await m.download())
    }
  } catch (e) { 
    console.error('Error processing image:', e) 
  }
  
  if (img) console.log(img.trimEnd())

  if (typeof m.text === 'string' && m.text) {
    let log = m.text.replace(/\u200e+/g, '')
    log = log.split('\n').map(line => line.trim().startsWith('>') ? chalk.bgGray.dim(line.replace(/^>/, '┃')) : line).join('\n')
    
    if (log.length < 1024) {
      try {
        log = log.replace(urlRegex, (url) => chalk.blueBright(url))
      } catch (e) {
        console.error('Error processing URLs:', e)
      }
    }
    
    if (Array.isArray(m.mentionedJid)) {
      for (let jid of m.mentionedJid.filter(Boolean)) {
        try {
          const display = await safeGetName(conn, jid)
          const bare = jid.split('@')[0]
          log = log.replace('@' + bare, chalk.blueBright('@' + (display || bare)))
        } catch (e) {
          console.error('Error processing mentioned JID:', e)
        }
      }
    }
    
    console.log(m.error != null ? chalk.red(log) : m.isCommand ? chalk.yellow(log) : log)
  }
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => { console.log(chalk.redBright("Update 'lib/print.js'")) })

async function formatMessageTypes(messageStubType) {
  switch (messageStubType) {
    case 'conversation': return 'Conversación'
    case 'imageMessage': return 'Imagen'
    case 'contactMessage': return 'Contacto'
    case 'locationMessage': return 'Ubicación'
    case 'extendedTextMessage': return 'Texto'
    case 'documentMessage': return 'Documento'
    case 'audioMessage': return 'Audio'
    case 'videoMessage': return 'Video'
    case 'call': return 'Llamada'
    case 'chat': return 'Chat'
    case 'protocolMessage': return 'Cifrado'
    case 'contactsArrayMessage': return 'Lista de contactos'
    case 'highlyStructuredMessage': return 'Estructurado'
    case 'fastRatchetKeySenderKeyDistributionMessage': return 'Distribución de claves'
    case 'sendPaymentMessage': return 'Mensaje de pago'
    case 'liveLocationMessage': return 'Ubicación en vivo'
    case 'requestPaymentMessage': return 'Solicitar pago'
    case 'declinePaymentRequestMessage': return 'Rechazar solicitud de pago'
    case 'cancelPaymentRequestMessage': return 'Cancelar solicitud de pago'
    case 'templateMessage': return 'Mensaje de plantilla'
    case 'stickerMessage': return 'Sticker'
    case 'groupInviteMessage': return 'Invitación a grupo'
    case 'templateButtonReplyMessage': return 'Respuesta de botón de plantilla'
    case 'productMessage': return 'Producto'
    case 'deviceSentMessage': return 'Mensaje enviado por dispositivo'
    case 'messageContextInfo': return 'Contexto del mensaje'
    case 'listMessage': return 'Lista'
    case 'viewOnceMessage': return 'Mensaje de una sola vez'
    case 'orderMessage': return 'Pedido'
    case 'listResponseMessage': return 'Respuesta de lista'
    case 'ephemeralMessage': return 'Efímero'
    case 'invoiceMessage': return 'Factura'
    case 'buttonsMessage': return 'Botones'
    case 'buttonsResponseMessage': return 'Respuesta de botones'
    case 'paymentInviteMessage': return 'Invitación de pago'
    case 'interactiveMessage': return 'Interactivo'
    case 'reactionMessage': return 'Reacción'
    case 'stickerSyncRmrMessage': return 'Sincronización de sticker'
    case 'interactiveResponseMessage': return 'Respuesta interactiva'
    case 'pollCreationMessage': return 'Creación de encuesta'
    case 'pollUpdateMessage': return 'Actualización de encuesta'
    case 'keepInChatMessage': return 'Mensaje de mantener en chat'
    case 'documentWithCaptionMessage': return 'Documento con leyenda'
    case 'requestPhoneNumberMessage': return 'Solicitud de número de teléfono'
    case 'viewOnceMessageV2': return 'Mensaje de una sola vez v2'
    case 'encReactionMessage': return 'Reacción encriptada'
    case 'editedMessage': return 'Mensaje editado'
    case 'viewOnceMessageV2Extension': return 'Extensión de mensaje de una vista v2'
    case 'pollCreationMessageV2': return 'Creación de encuesta v2'
    case 'scheduledCallCreationMessage': return 'Llamada programada'
    case 'groupMentionedMessage': return 'Mención en grupo'
    case 'pinInChatMessage': return 'Mensaje fijado en chat'
    case 'pollCreationMessageV3': return 'Creación de encuesta v3'
    case 'scheduledCallEditMessage': return 'Edición de llamada programada'
    case 'ptvMessage': return 'Mensaje de PTV'
    case 'botInvokeMessage': return 'Invocación de bot'
    case 'callLogMesssage': return 'Registro de llamada'
    case 'messageHistoryBundle': return 'Paquete de historial de mensajes'
    case 'encCommentMessage': return 'Comentario encriptado'
    case 'bcallMessage': return 'Mensaje de llamada B'
    case 'lottieStickerMessage': return 'Mensaje de sticker Lottie'
    case 'eventMessage': return 'Evento'
    case 'commentMessage': return 'Comentario'
    case 'newsletterAdminInviteMessage': return 'Mensaje de invitación de administrador'
    case 'extendedTextMessageWithParentKey': return 'Mensaje de texto con clave principal'
    case 'placeholderMessage': return 'Marcador de posición'
    case 'encEventUpdateMessage': return 'Actualización de evento encriptado'
    default: return messageStubType || 'No especificado'
  }
}

async function formaTxt(messageType) {
  if (!messageType) return 'No especificado'
  let formattedMessage = messageType.charAt(0).toUpperCase() + messageType.slice(1)
  formattedMessage = formattedMessage.replace(/([A-Z])/g, ' $1').trim()
  return formattedMessage
}