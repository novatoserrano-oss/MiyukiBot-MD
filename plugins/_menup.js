import fs from 'fs'
import moment from 'moment-timezone'
import PhoneNumber from 'awesome-phonenumber'
import { proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, args, usedPrefix, command, text }) => {
  try {
    const argumento = text?.trim()?.toLowerCase()
    if (argumento !== 'descargas') return

    await m.react('📥')

    const fecha = moment.tz('America/Lima').format('DD/MM/YYYY')
    const hora = moment.tz('America/Lima').format('hh:mm:ss A')
    const dia = moment.tz('America/Lima').locale('es').format('dddd')
    const diaCapitalizado = dia.charAt(0).toUpperCase() + dia.slice(1)

    const userId = m.sender.split('@')[0]
    const user = global.db.data.users[m.sender] || {}
    const limit = user.limit || 0
    const premium = user.premium ? '✅ Sí' : '❌ No'
    const totalUsers = Object.keys(global.db.data.users).length
    const comandosTotales = Object.keys(global.plugins).length

    const phone = PhoneNumber('+' + userId)
    const pais = phone.getRegionCode() ? phone.getRegionCode() : 'Desconocido 🌍'

    const channel = 'https://whatsapp.com/channel/0029VbAtbPA84OmJSLiHis2U'
    const owner = 'https://wa.me/51919199620'
    const ig = 'https://www.instagram.com/shadow_xyz9?igsh=aWFtNTIwczlhNnQ4'
    const logo = 'https://shadow-xyz.vercel.app/img/shadow13.jpg'

    const comandos = Object.values(global.plugins)
      .filter(plugin => plugin.help && plugin.tags && plugin.tags.includes('descargas'))
      .map(plugin => Array.isArray(plugin.help) ? plugin.help : [plugin.help])
      .flat()
      .map(cmd => `> ☁️ ${usedPrefix}${cmd}`)
      .join('\n')

    const cuerpo = `──────────────────────
〔 *🧁 _ᴍᴇɴᴜ - ᴅᴇsᴄᴀʀɢᴀs_ 🧁* 〕
──────────────────────
 
✎ 🧸 *Usuario:* @${userId}
✎ 🍓 *País:* ${pais}
✎ 📡 *Prefijo:* ${usedPrefix}
✎ 💖 *Premium:* ${premium}
✎ 🍬 *Límite:* ${limit}
✎ 🐰 *Usuarios Totales:* ${totalUsers}
✎ 🪞 *Comandos:* ${comandosTotales}
✎ 💫 *Fecha:* ${hora}, ${fecha}, ${diaCapitalizado}
──────────────────────

🍋 𝘾𝙊𝙈𝘼𝙉𝘿𝙊𝙎
`.trim()

    const menu = comandos 
      ? `${cuerpo}\n\n${comandos}`
      : `${cuerpo}`

    const nativeFlowButtons = proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
      buttons: [
        {
          name: 'cta_url',
          buttonParamsJson: JSON.stringify({
            display_text: '📢 Canal Oficial',
            url: channel,
            merchant_url: channel
          })
        },
        {
          name: 'cta_url',
          buttonParamsJson: JSON.stringify({
            display_text: '🌷 Instagram',
            url: ig,
            merchant_url: ig
          })
        },
        {
          name: 'cta_url',
          buttonParamsJson: JSON.stringify({
            display_text: '📞 contacto',
            url: owner,
            merchant_url: owner
          })
        }
      ]
    })

    await conn.relayMessage(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              body: { text: menu },
              footer: { text: '🍓 bot de mrd | Menu Descargas' },
              header: {
                title: '✨ Bienvenid@ soy?, ʀbot de mrd xD',
                subtitle: '',
                hasMediaAttachment: true,
                imageMessage: (await conn.prepareMessageMedia({ image: { url: logo } }, { upload: conn.waUploadToServer })).imageMessage
              },
              nativeFlowMessage: nativeFlowButtons,
              contextInfo: {
                mentionedJid: [m.sender],
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: '120363422142340004@newsletter',
                  serverMessageId: 100,
                  newsletterName: 'bot de mrd : 𝖢𝗁𝖺𝗇𝗇𝖾𝗅 𝖮𝖿𝗂𝖼𝗂𝖺𝗅'
                },
                externalAdReply: {
                  title: '🍓 bot de mrd - MD',
                  body: '✨ Descarga tus archivos favoritos.',
                  thumbnailUrl: logo,
                  mediaType: 1,
                  renderLargerThumbnail: true,
                  sourceUrl: channel
                }
              }
            }
          }
        }
      },
      {}
    )

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, `Error al mostrar el menú de descargas:\n${e.message}`, m, fake)
  }
}

handler.command = ['menp']
handler.tags = ['menus']
handler.help = ['mep']
handler.register = true

export default handler