import fetch from "node-fetch"
import { saveDatabase } from "../lib/database.js"

let handler = async (m, { conn, usedPrefix, command, args }) => {
  const toNum = (jid = '') => String(jid).split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
  const senderNum = toNum(m.sender)
  const botId = conn?.user?.id || ''
  const owners = Array.isArray(global.owner) ? global.owner.map(v => Array.isArray(v) ? v[0] : v) : []
  const isROwner = [botId, ...owners].map(v => toNum(v)).includes(senderNum)
  const isOwner = isROwner || !!m.fromMe

  let settings = global.db?.data?.settings || (global.db.data.settings = {})
  let bot = settings[conn.user.jid] || (settings[conn.user.jid] = {})

  // Comando de ayuda
  if (!args[0] || args[0] === 'help') {
    const imageUrl = "https://files.catbox.moe/b10cv6.jpg"
    let imageBuffer = await fetch(imageUrl).then(res => res.buffer())
    
    const helpMessage = `꒰⌢ ʚ˚₊‧ ⌨️ ꒱꒱ :: *AUTOTYPE* ıllı

੭੭ ﹙ 📌 ﹚:: *Uso del comando*
\`\`\`Controla la escritura automática del bot con efecto de puntos "..."\`\`\`

੭੭ ﹙ 🍒 ﹚:: *Comandos disponibles*
• ${usedPrefix}autotype on - Activar autotype
• ${usedPrefix}autotype off - Desactivar autotype
• ${usedPrefix}autotype status - Ver estado actual
• ${usedPrefix}autotype help - Mostrar esta ayuda

੭੭ ﹙ ⚠️ ﹚:: *Nota importante*
\`\`\`Solo propietarios pueden usar este comando\`\`\`

‐ ダ *ɪᴛsᴜᴋɪ ɴᴀᴋᴀɴᴏ ᴀɪ* ギ`

    await conn.sendMessage(m.chat, {
      image: imageBuffer,
      caption: helpMessage
    }, { quoted: m })
    return
  }

  const subCommand = args[0].toLowerCase()

  // Verificar permisos de propietario
  if (!isOwner) { 
    return m.reply(`꒰⌢ ʚ˚₊‧ 🚫 ꒱꒱ :: *ACCESO DENEGADO* ıllı

੭੭ ﹙ ❌ ﹚:: *Sin permisos*

\`\`\`Este comando solo está disponible para propietarios del bot\`\`\`

੭੭ ﹙ ℹ️ ﹚:: *Información*
\`\`\`Contacta con el owner si necesitas usar esta función\`\`\`

‐ ダ *ɪᴛsᴜᴋɪ ɴᴀᴋᴀɴᴏ ᴀɪ* ギ`)
  }

  switch (subCommand) {
    case 'on':
    case 'activar':
    case 'enable':
    case '1':
      bot.autotypeDotOnly = true
      await saveDatabase()
      await m.reply(`꒰⌢ ʚ˚₊‧ ⌨️ ꒱꒱ :: *AUTOTYPE* ıllı

੭੭ ﹙ ✅ ﹚:: *Función activada*

\`\`\`El bot ahora mostrará escritura automática con efecto de puntos "..." en sus respuestas\`\`\`

੭੭ ﹙ 🎀 ﹚:: *Estado*
\`\`\`AUTOTYPE: Activado\`\`\`

‐ ダ *ɪᴛsᴜᴋɪ ɴᴀᴋᴀɴᴏ ᴀɪ* ギ`)
      break

    case 'off':
    case 'desactivar':
    case 'disable':
    case '0':
      bot.autotypeDotOnly = false
      await saveDatabase()
      await m.reply(`꒰⌢ ʚ˚₊‧ ⌨️ ꒱꒱ :: *AUTOTYPE* ıllı

੭੭ ﹙ ❌ ﹚:: *Función desactivada*

\`\`\`El bot ya no mostrará escritura automática con efecto de puntos en sus respuestas\`\`\`

੭੭ ﹙ 🎀 ﹚:: *Estado*
\`\`\`AUTOTYPE: Desactivado\`\`\`

‐ ダ *ɪᴛsᴜᴋɪ ɴᴀᴋᴀɴᴏ ᴀɪ* ギ`)
      break

    case 'status':
    case 'estado':
    case 'info':
      const status = bot.autotypeDotOnly ? '🟢 ACTIVADO' : '🔴 DESACTIVADO'
      await m.reply(`꒰⌢ ʚ˚₊‧ 📊 ꒱꒱ :: *ESTADO ACTUAL* ıllı

੭੭ ﹙ 🎀 ﹚:: *Estado de Autotype*
\`\`\`${status}\`\`\`

੭੭ ﹙ ⚙️ ﹚:: *Descripción*
\`\`\`Efecto de escritura con "..." en mensajes\`\`\`

੭੭ ﹙ 🔧 ﹚:: *Control*
\`\`\`Solo propietarios pueden modificar\`\`\`

੭੭ ﹙ 💡 ﹚:: *Uso*
• ${usedPrefix}autotype on/off
• ${usedPrefix}autotype status

‐ ダ *ɪᴛsᴜᴋɪ ɴᴀᴋᴀɴᴏ ᴀɪ* ギ`)
      break

    default:
      await m.reply(`꒰⌢ ʚ˚₊‧ ⚠️ ꒱꒱ :: *COMANDO NO VÁLIDO* ıllı

੭੭ ﹙ ❌ ﹚:: *Opción no reconocida*
\`\`\`${subCommand}\`\`\`

੭੭ ﹙ 🛠️ ﹚:: *Comandos válidos*
• on - Activar función
• off - Desactivar función
• status - Ver estado
• help - Mostrar ayuda

੭੭ ﹙ 💡 ﹚:: *Ejemplo*
${usedPrefix}autotype on

‐ ダ *ɪᴛsᴜᴋɪ ɴᴀᴋᴀɴᴏ ᴀɪ* ギ`)
      break
  }
}

handler.help = ['autotype']
handler.tags = ['owner']
handler.command = /^(autotype|autotipo)$/i

export default handler