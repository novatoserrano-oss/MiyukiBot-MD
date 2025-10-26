import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'

let handler = async (m, { conn, usedPrefix, __dirname, participants }) => {
  try {
    await m.react('🌷')

    const user = global.db.data.users[m.sender] || {}
    const name = await conn.getName(m.sender)
    const premium = user.premium ? '💎 Premium' : '🪶 Gratis'
    const limit = user.limit || 0
    const totalreg = Object.keys(global.db.data.users).length
    const groupUserCount = m.isGroup ? participants.length : '-'
    const groupsCount = Object.values(conn.chats).filter(v => v.id.endsWith('@g.us')).length
    const uptime = formatTime(process.uptime() * 1000)
    const fecha = new Date(Date.now())
    const locale = 'es-PE'
    const dia = fecha.toLocaleDateString(locale, { weekday: 'long' })
    const fechaTxt = fecha.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    const hora = fecha.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })

    const totalCommands = Object.keys(global.plugins).length

    const userId = m.sender.split('@')[0]
    const phone = PhoneNumber('+' + userId)
    const pais = phone.getRegionCode() || '🌎 Desconocido'
    
    const perfil = await conn.profilePictureUrl(conn.user.jid, 'image')
      .catch(() => banner)

    const canal = { 
      id: '120363422169517881@newsletter', 
      name: '🌸 𝐌𝐢𝐲𝐮𝐤𝐢𝐁𝐨𝐭 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🌸'
    }

    const metaMsg = {
      quoted: global.fakeMetaMsg,
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: canal.id,
          serverMessageId: 77,
          newsletterName: canal.name
        },
        externalAdReply: {
          title: botname,
          body: dev,
          mediaUrl: null,
          description: null,
          previewType: "PHOTO",
          thumbnailUrl: perfil,
          mediaType: 1,
          renderLargerThumbnail: false
        }
      }
    }

    const categorias = {
      'info': '🌼 〢 ɪɴғᴏʀᴍᴀᴄɪᴏɴ',
      'main': '🍃 〢 ᴍᴇɴᴜ ᴘʀɪɴᴄɪᴘᴀʟ',
      'fun': '🎭 〢 ᴊᴜᴇɢᴏs & ᴅɪᴠᴇʀsɪᴏɴ',
      'rpg': '⚔️ 〢 ʀᴘɢ ᴍᴏᴅᴏ',
      'anime': '🌸 〢 ᴀɴɪᴍᴇ ᴡᴏʀʟᴅ',
      'download': '🎧 〢 ᴅᴇsᴄᴀʀɢᴀs',
      'tools': '🧩 〢 ᴛᴏᴏʟs & ᴜᴛɪʟɪᴅᴀᴅᴇs',
      'sticker': '💮 〢 sᴛɪᴄᴋᴇʀ ᴢᴏɴᴇ',
      'group': '🏮 〢 ɢʀᴜᴘᴏs & ᴀᴅᴍɪɴs',
      'owner': '🌹 〢 ᴏᴡɴᴇʀ & sᴛᴀғғ',
      'ia': '☁️ 〢 ɪɴᴛᴇʟɪɢᴇɴᴄɪᴀ ᴀʀᴛɪғɪᴄɪᴀʟ',
      'nsfw': '🍑 〢 ᴍᴏᴅᴏ +18'
    }

    const comandos = Object.values(global.plugins)
      .filter(v => v.help && v.tags)
      .map(v => ({
        help: Array.isArray(v.help) ? v.help : [v.help],
        tags: Array.isArray(v.tags) ? v.tags : [v.tags]
      }))

    let menuTexto = ''
    for (let cat in categorias) {
      let cmds = comandos
        .filter(c => c.tags.includes(cat))
        .map(c => c.help.map(h => `${usedPrefix}${h}`).join('\n'))
        .join('\n')
      if (cmds) {
        menuTexto += `\n\n*${categorias[cat]}*\n${cmds}`
      }
    }

    const infoUser = `
╭━━━〔 ᴍɪʏᴜᴋɪʙᴏᴛ 🌸 〕━━⬣
│💫 *Usuario:* @${userId}
│🌷 *Estado:* ${premium}
│🌎 *País:* ${pais}
│🍃 *Límite:* ${limit}
│🧭 *Usuarios:* ${totalreg}
│🏮 *Grupos:* ${groupsCount}
│⏰ *Uptime:* ${uptime}
│🌸 *Versión:* ${vs}
│⚙️ *Librería:* ${libreria}
│📆 *Fecha:* ${hora}, ${dia}, ${fechaTxt}
╰━━━━━━━━━━━━━━━━━━⬣

🌼 *Desarrollador:* Omar Granda 🌙
─────────────────────
🍧 *Menú disponible:*`.trim()

    const finalText = `${infoUser}\n${menuTexto}`

    const videos = [
      'https://shadow-xyz.vercel.app/videos/shadow1.mp4',
      '',
      ''
    ]
    const videoUrl = videos[Math.floor(Math.random() * videos.length)]

    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: finalText,
      fileName: '🌙 MiyukiBot | Menú Oficial 🌸',
      mimetype: 'video/mp4',
      mentions: [m.sender],
      ...metaMsg
    })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { 
      text: `💔 Ocurrió un error al mostrar el menú.\n> ${e.message}`,
      mentions: [m.sender] 
    })
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu','help','menú','allmenu']

export default handler

function formatTime(ms) {
  const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}