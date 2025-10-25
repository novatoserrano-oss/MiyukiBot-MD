import os from 'os'
import moment from 'moment-timezone'
import speed from 'performance-now'

let handler = async (m, { conn }) => {
  try {
    await m.react('🌸')
    conn.sendPresenceUpdate('composing', m.chat)

    let mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let totalCommands = Object.keys(global.plugins).length
    const iconos = [
      'https://files.catbox.moe/lee8v6.jpg',
      'https://files.catbox.moe/cut28l.jpg',
      'https://files.catbox.moe/rut9jj.jpg',
      'https://files.catbox.moe/lgq7yr.jpg',
      'https://files.catbox.moe/8pil8x.jpg',
      'https://files.catbox.moe/6a3vsc.jpg',
      'https://files.catbox.moe/ltc7g2.jpg',
      'https://files.catbox.moe/kt7pbi.jpg',
      'https://files.catbox.moe/vskjfh.jpg'
    ]
    const randomIcono = iconos[Math.floor(Math.random() * iconos.length)]

    const vs = global.vs || '1.8.0'
    const libreria = global.libreria || 'Baileys'
    const botname = global.botname || 'MiyukiBot-MD'
    const textbot = global.textbot || 'MiyukiBot-MD 🌸'
    const redes = global.redes || 'https://github.com/'
    const channelRD = global.channelRD || { id: '', name: 'Canal Oficial 🌸' }

    // ⏳ Ping
    let timestamp = speed()
    let ping = (speed() - timestamp).toFixed(2)

    // 🕓 Uptime
    let uptime = clockString(process.uptime() * 1000)

    // 🖥️ RAM info
    let total = (os.totalmem() / 1024 / 1024).toFixed(0)
    let free = (os.freemem() / 1024 / 1024).toFixed(0)
    let used = total - free

    // 📅 Fecha y hora
    let fecha = moment.tz('America/Lima').format('DD/MM/YYYY')
    let hora = moment.tz('America/Lima').format('HH:mm:ss')
    let dia = moment.tz('America/Lima').format('dddd')
    let menu = `
╭━━━〔 🌸 𝐌𝐢𝐲𝐮𝐤𝐢𝐁𝐨𝐭-𝐌𝐃 〕━━⬣
│👤 *Usuario:* @${mentionedJid.split('@')[0]}
│📚 *Comandos:* ${totalCommands}
│⚙️ *Versión:* ${vs}
│🧩 *Librería:* ${libreria}
│🤖 *Modo:* ${(conn.user.jid == global.conn.user.jid ? 'Principal' : 'Sub-Bot')}
│⏱️ *Uptime:* ${uptime}
╰━━━━━━━━━━━━━━━━━━⬣

╭─〔 💻 ESTADO DEL SISTEMA 〕─⬣
│💾 *RAM Total:* ${total} MB
│📈 *RAM Usada:* ${used} MB
│🪫 *RAM Libre:* ${free} MB
│📶 *Ping:* ${ping} ms
╰━━━━━━━━━━━━━━━━━━⬣

╭─〔 🗓️ FECHA Y HORA 〕─⬣
│📅 *Día:* ${dia}
│📆 *Fecha:* ${fecha}
│⏰ *Hora:* ${hora}
╰━━━━━━━━━━━━━━━━━━⬣

╭─〔 💰 ECONOMÍA 〕─⬣
│💼 *#work • #trabajar*
│🎰 *#casino • #slot* + [cantidad]
│🪙 *#balance • #bank* + <usuario>
│🏦 *#deposit • #withdraw* + [cantidad]
│🎁 *#daily • #weekly • #monthly*
│💸 *#steal • #robar* + [@usuario]
│📊 *#economyboard • #baltop*
│⚒️ *#miming • #mine • #adventure*
│🐟 *#fish • #hunt • #dungeon*
╰──────────────────⬣

╭─〔 📥 DESCARGAS 〕─⬣
│🎵 *#play • #ytmp3 • #ytmp4*
│🎬 *#tiktok • #instagram • #facebook*
│📦 *#mediafire • #mega*
│🔍 *#ytsearch • #pinterest • #image*
│📱 *#apk • #modapk*
╰──────────────────⬣

╭─〔 🎴 GACHA 〕─⬣
│💞 *#claim • #harem • #buychar*
│💎 *#rollwaifu • #wshop • #sell*
│📖 *#animeinfo • #animelist*
│💌 *#vote • #topwaifus • #robwaifu*
│🎀 *#givechar • #trade*
╰──────────────────⬣

╭─〔 ⚙️ SOCKETS 〕─⬣
│🤖 *#qr • #bots • #status*
│🔐 *#logout • #setpfp • #setstatus*
│🪪 *#setusername • #join • #leave*
╰──────────────────⬣

╭─〔 🧠 UTILIDADES 〕─⬣
│📘 *#help • #menu • #sc*
│🧮 *#calcular • #traducir • #wiki*
│🎨 *#sticker • #toimg • #brat*
│🔎 *#google • #dalle • #tourl*
│🗣️ *#say • #ia • #readviewonce*
│🧾 *#gitclone • #ssweb*
╰──────────────────⬣

╭─〔 👤 PERFIL 〕─⬣
│🏆 *#leaderboard • #level*
│💍 *#marry • #divorce*
│🧭 *#profile • #setdesc • #setfav*
│🎂 *#setbirth • #delbirth*
│🚹 *#setgenre • #delgenre*
│⭐ *#prem • #vip*
╰──────────────────⬣

╭─〔 👥 GRUPOS 〕─⬣
│📣 *#tagall • #hidetag • #invocar*
│🛡️ *#antilink • #welcome • #bot* [on/off]
│🚪 *#kick • #add • #promote • #demote*
│🔐 *#onlyadmin • #close • #open*
│📝 *#gpdesc • #gpname • #gpbanner*
│⚠️ *#warn • #unwarn • #advlist*
│📋 *#infogrupo • #link • #admins*
╰──────────────────⬣

╭─〔 🌸 ANIME REACCIONES 〕─⬣
│😡 *#angry*  │ 😭 *#cry*
│🥰 *#hug*    │ 😘 *#kiss*
│😳 *#blush*  │ 🤣 *#laugh*
│😔 *#sad*    │ 😏 *#facepalm*
│🤭 *#shy*    │ 😴 *#sleep*
│👋 *#wave*   │ 🤔 *#think*
│💢 *#slap*   │ 😍 *#love*
│🫶 *#handhold* │ ✋ *#highfive*
│🌸 *#waifu*  │ 🤟 *#ppcouple*
╰──────────────────⬣

👑 *© Powered by OmarGranda*
🌐 *MiyukiBot-MD*
`
export default menu;
    await conn.sendMessage(m.chat, {
      text: menu,
      contextInfo: {
        mentionedJid: [mentionedJid],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          serverMessageId: '',
          newsletterName: channelRD.name
        },
        externalAdReply: {
          title: botname,
          body: textbot,
          mediaType: 1,
          mediaUrl: redes,
          sourceUrl: redes,
          thumbnailUrl: randomIcono,
          showAdAttribution: false,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('Ocurrió un error al generar el menú.')
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'menú', 'help']
handler.register = true

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}