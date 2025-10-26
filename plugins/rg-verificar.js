import db from '../lib/database.js'
import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'
import { createHash } from 'crypto'  
import fetch from 'node-fetch'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

let handler = async function (m, { conn, text, usedPrefix, command }) {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let pp = await conn.profilePictureUrl(who, 'image').catch((_) => 'https://files.catbox.moe/xr2m6u.jpg')
  let user = global.db.data.users[m.sender]
  let name2 = conn.getName(m.sender)

  let bio
  try {
    const info = await conn.fetchStatus(who)
    bio = info?.status?.trim() || "🚫 Sin biografía disponible"
  } catch {
    bio = "Sin biografía disponible"
  }

  if (user.registered) {
   const texto = 
`
*🗣️ Ya cuentas con un registro activo...*
  
¿𝐐𝐮𝐢𝐞𝐫𝐞𝐬 𝐫𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐫𝐭𝐞 𝐧𝐮𝐞𝐯𝐚𝐦𝐞𝐧𝐭𝐞? 

🫵 Usa *#unreg* para borrar tu registro y comenzar otra vez.`;

    const botones = [
      { buttonId: `${usedPrefix}unreg`, buttonText: { displayText: '🚯 Eliminar Registro' }, type: 1 },
    ];

    return await conn.sendMessage(m.chat, {
      image: { url: 'https://qu.ax/mCcQs.jpg' },
      caption: texto,
      mentions: [m.sender],
      footer: dev,
      buttons: botones,
      headerType: 4,
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          serverMessageId: 100,
          newsletterName: channelRD.name
        }
      }
    }, { quoted: fkontak });
 }

  if (!Reg.test(text)) {
     const mensaje = `
┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

❌ ᴏᴏᴘꜱ ᴄᴏᴍᴀɴᴅᴏ ɪɴᴄᴏʀʀᴇᴄᴛᴏ 

┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
  
🫵  𝑼́𝒔𝒂𝒍𝒐 𝒂𝒔𝒊́:  
   ${usedPrefix + command} nombre.edad  

 📌 𝑬𝒋𝒆𝒎𝒑𝒍𝒐:  
> ${usedPrefix + command} ${name2}.18  

┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`;

     const botones = [
       { buttonId: `${usedPrefix}reg ${name2}.18`, buttonText: { displayText: '🖍️ Auto Verificación' }, type: 1 },
     ];

    return await conn.sendMessage(m.chat, {
      image: { url: 'https://qu.ax/iNweS.jpg' },
      caption: mensaje,
      mentions: [m.sender],
      footer: dev,
      buttons: botones,
      headerType: 4,
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          serverMessageId: 100,
          newsletterName: channelRD.name
        }
      }
    }, { quoted: fkontak });
  }

  let hora = new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima' });
    
  let fechaObj = new Date();
  let fecha = fechaObj.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Lima' });
  let dia = fechaObj.toLocaleDateString('es-PE', { weekday: 'long', timeZone: 'America/Lima' });

  let [_, name, splitter, age] = text.match(Reg)
  if (!name) return m.reply(`❌ *El nombre no puede estar vacío*`)
  if (!age) return m.reply(`❌ *La edad no puede estar vacía*`)
  if (name.length >= 100) return m.reply(`❌ *El nombre es demasiado largo...*`)
  age = parseInt(age)

  user.name = `${name} ✓`
  user.age = age
  user.regTime = + new Date      
  user.registered = true
  user.coin = (user.coin || 0) + 40
  user.exp = (user.exp || 0) + 300
  user.joincount = (user.joincount || 0) + 20

  let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 20)
  

  let regbot = `≡══════════════════≡
彡 𝐑𝐄𝐆𝐈𝐒𝐓𝐑𝐎 • 𝐂𝐎𝐌𝐏𝐋𝐄𝐓𝐎 彡
≡══════════════════≡

╭━━━━━ ˚₊· ͟͟͞͞➳❥
│ *🍓ɴᴏᴍʙʀᴇ:* ${name}
│ *💫 ᴜsᴇʀ:*  ${name2}
│ *📱ɴᴜᴍᴇʀᴏ:* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
│ *🐰ᴇᴅᴀᴅ:* ${age} años
│ *🕸️ ʙɪᴏ:* ${bio}
├────────────
│ *📖 ғᴇᴄʜᴀ:* ${fecha}
│ *⌛ ʜᴏʀᴀ:* ${hora}
│ *🌙 ᴅɪᴀ:* ${dia}
╰━━━━━ ˚₊· ͟͟͞͞➳❥

🤗 *¡Bienvenido ${name}!*
Tu registro ha sido completado exitosamente ✅`

  await m.react?.('📩')

  await conn.sendMessage(
    m.chat,
    {
      image: { url: pp },
      caption: regbot,
      contextInfo: {
      mentionedJid: [m.sender],
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelRD.id,
          serverMessageId: 100,
          newsletterName: channelRD.name
        },
        externalAdReply: {
          title: '𝙈𝙞𝙮𝙪𝙠𝙞𝘽𝙤𝙩-𝙈𝘿',
          body: 'Verificando registro...',
          mediaType: 1,
          thumbnailUrl: 'https://qu.ax/NtBCa.jpg',
          mediaUrl: redes,
          sourceUrl: redes,
          renderLargerThumbnail: true
        }
      }
    },
    { quoted: fkontak });
  };

handler.help = ['reg']
handler.tags = ['rg']
handler.command = ['verify', 'verificar', 'reg', 'register', 'registrar'] 

export default handler