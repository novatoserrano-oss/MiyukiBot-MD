import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'

let handler = async (m, { conn, usedPrefix, __dirname, participants }) => {
  try {
    await m.react('🌸')

    const user = global.db.data.users[m.sender] || {}
    const name = await conn.getName(m.sender)
    const premium = user.premium ? '💎 Sí' : '💤 No'
    const limit = user.limit || 0
    const totalreg = Object.keys(global.db.data.users).length
    const groupUserCount = m.isGroup ? participants.length : '-'
    const groupsCount = Object.values(conn.chats).filter(v => v.id.endsWith('@g.us')).length
    const uptime = clockString(process.uptime() * 1000)
    const fecha = new Date(Date.now())
    const locale = 'es-PE'
    const dia = fecha.toLocaleDateString(locale, { weekday: 'long' })
    const fechaTxt = fecha.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    const hora = fecha.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })

    const userId = m.sender.split('@')[0]
    const phone = PhoneNumber('+' + userId)
    const pais = phone.getRegionCode() || '🌐 Desconocido'
    
    const perfil = await conn.profilePictureUrl(conn.user.jid, 'image')
      .catch(() => 'https://files.catbox.moe/9i5o9z.jpg')

    const channelRD = { 
      id: '120363422142340004@newsletter', 
      name: '🌷 MiyukiBot-MD | Canal Oficial'
    }

    const metaMsg = {
      quoted: global.fakeMetaMsg,
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          serverMessageId: 100,
          newsletterName: channelRD.name
        },
        externalAdReply: {
          title: '🌸 MiyukiBot-MD',
          body: '💖 Dev: Shadow_xyz 🍓',
          mediaUrl: null,
          description: null,
          previewType: "PHOTO",
          thumbnailUrl: perfil,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }

    let tags = {
      'main': '🌸✨ `ＭＥＮＵ ＰＲＩＮＣＩＰＡＬ` ✨🌸',
      'fun': '🎠💫 `ＭＥＮＵ ＤＩＶＥＲＳＩＯＮ` 💫🎠',
      'anime': '🍡🎀 `ＭＥＮＵ ＡＮＩＭＥ` 🎀🍡',
      'descargas': '📥🍰 `ＭＥＮＵ ＤＥＳＣＡＲＧＡＳ` 🍰📥',
      'grupo': '🏮🌸 `ＭＥＮＵ ＧＲＵＰＯＳ` 🌸🏮',
      'ai': '☁️💭 `ＭＥＮＵ ＩＡ` 💭☁️',
      'tools': '🧩🧁 `ＭＥＮＵ ＴＯＯＬＳ` 🧁🧩',
      'owner': '⚙️💖 `ＭＥＮＵ ＯＷＮＥＲ` 💖⚙️',
      'jadibot': '🍰✨ `ＭＥＮＵ ＪＡＤＩＢＯＴ` ✨🍰',
      'nsfw': '🍑🌸 `ＭＥＮＵ ＮＳＦＷ` 🌸🍑',
    }

    let commands = Object.values(global.plugins)
      .filter(v => v.help && v.tags)
      .map(v => {
        return {
          help: Array.isArray(v.help) ? v.help : [v.help],
          tags: Array.isArray(v.tags) ? v.tags : [v.tags]
        }
      })

    let menuTexto = ''
    for (let tag in tags) {
      let comandos = commands
        .filter(cmd => cmd.tags.includes(tag))
        .map(cmd => cmd.help.map(e => `💞 ${usedPrefix}${e}`).join('\n'))
        .join('\n')
      if (comandos) {
        menuTexto += `\n\n╭───🌸 ${tags[tag]} 🌸───╮\n${comandos}\n╰──────────────────────╯`
      }
    }

    const infoUser = `
╭───♡ 🌷 *Bienvenid@ a MiyukiBot-MD* 🌷 ♡───╮
│ 🍓 *Usuario:* @${userId}
│ 🌸 *Nombre:* ${name}
│ 💎 *Premium:* ${premium}
│ 🌍 *País:* ${pais}
│ 🍡 *Límite:* ${limit}
│ 🧁 *Usuarios Totales:* ${totalreg}
│ ☁️ *Grupos Activos:* ${groupsCount}
│ ⏰ *Tiempo Activo:* ${uptime}
│ 📅 *Fecha:* ${dia}, ${fechaTxt}
│ 🕐 *Hora:* ${hora}
╰──────────────────────────────╯
`.trim()

    const cuerpo = `${infoUser}\n\n💖 *Menú Disponible:* 💖\n${menuTexto}`.trim()

    const vids = [
      'https://files.catbox.moe/tc1zxx.mp4',
      'https://files.catbox.moe/o3ggg8.mp4'
    ]
    let videoUrl = vids[Math.floor(Math.random() * vids.length)]

    await conn.sendMessage(m.chat, {
      document: fs.readFileSync('./README.md'),
      fileName: '🌸 MiyukiBot-MD | Menú Kawaii 💖',
      mimetype: 'application/pdf',
      caption: cuerpo,
      gifPlayback: true,
      mentions: [m.sender],
      ...metaMsg
    })

  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { 
      text: `❌ Ups... ocurrió un error enviando el menú:\n${e.message}`,
      mentions: [m.sender] 
    })
  }
}

handler.help = ['menup']
handler.tags = ['main']
handler.command = ['menup']
handler.register = true

export default handler

function clockString(ms) {
  const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  const m = isNaN(ms) ? '--' : Math.floor