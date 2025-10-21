import { randomBytes } from 'crypto'

let handler = async (m, { conn, usedPrefix, command, args }) => {
  const toNum = (jid = '') => String(jid).split('@')[0].split(':')[0].replace(/[^0-9]/g, '')
  const senderNum = toNum(m.sender)
  const botId = conn?.user?.id || ''
  const owners = Array.isArray(global.owner) ? global.owner.map(v => Array.isArray(v) ? v[0] : v) : []
  const isROwner = [botId, ...owners].map(v => toNum(v)).includes(senderNum)
  const isOwner = isROwner || !!m.fromMe

  // Comando de ayuda
  if (!args[0] || args[0] === 'help') {
    const helpMessage = `꒰⌢ ʚ˚₊‧ ⌨️ ꒱꒱ :: *AUTOTYPE* ıllı

੭੭ ﹙ 📌 ﹚:: *Uso del comando*
\`\`\`Controla la escritura automática del bot con efecto de "escribiendo..."\`\`\`

੭੭ ﹙ 🍒 ﹚:: *Comandos disponibles*
• ${usedPrefix}autotype on - Activar autotype
• ${usedPrefix}autotype off - Desactivar autotype
• ${usedPrefix}autotype status - Ver estado actual
• ${usedPrefix}autotype help - Mostrar esta ayuda

੭੭ ﹙ ⚡ ﹚:: *Funcionamiento*
\`\`\`Activa/desactiva el efecto de escritura en TODOS los mensajes\`\`\`

੭੭ ﹙ ⚠️ ﹚:: *Nota importante*
\`\`\`Solo propietarios pueden usar este comando\`\`\`

‐ ダ *ɪᴛsᴜᴋɪ ɴᴀᴋᴀɴᴏ ᴀɪ* ギ`

    await conn.sendMessage(m.chat, { 
      text: helpMessage 
    }, { quoted: m })
    return
  }

  const subCommand = args[0].toLowerCase()

  // Verificar permisos de propietario
  if (!isOwner) { 
    return m.reply(`꒰⌢ ʚ˚₊‧ 🚫 ꒱꒱ :: *ACCESO DENEGADO* ıllı

੭੭ ﹙ ❌ ﹚:: *Sin permisos*

\`\`\`Este comando solo está disponible para propietarios del bot\`\`\`

‐ ダ *ɪᴛsᴜᴋɪ ɴᴀᴋᴀɴᴏ ᴀɪ* ギ`)
  }

  // Inicializar variable global si no existe
  if (global.autotype === undefined) {
    global.autotype = true // Activado por defecto
  }

  switch (subCommand) {
    case 'on':
    case 'activar':
    case 'enable':
    case '1':
      global.autotype = true
      await m.reply(`꒰⌢ ʚ˚₊‧ ⌨️ ꒱꒱ :: *AUTOTYPE* ıllı

੭੭ ﹙ ✅ ﹚:: *Función activada*

\`\`\`El bot ahora mostrará efecto de escritura en TODOS los mensajes\`\`\`

੭੭ ﹙ 🎀 ﹚:: *Estado*
\`\`\`AUTOTYPE: 🟢 ACTIVADO\`\`\`

‐ ダ *ɪᴛsᴜᴋɪ ɴᴀᴋᴀɴᴏ ᴀɪ* ギ`)
      break

    case 'off':
    case 'desactivar':
    case 'disable':
    case '0':
      global.autotype = false
      await m.reply(`꒰⌢ ʚ˚₊‧ ⌨️ ꒱꒱ :: *AUTOTYPE* ıllı

੭੭ ﹙ ❌ ﹚:: *Función desactivada*

\`\`\`El bot ya no mostrará efecto de escritura en los mensajes\`\`\`

੭੭ ﹙ 🎀 ﹚:: *Estado*
\`\`\`AUTOTYPE: 🔴 DESACTIVADO\`\`\`

‐ ダ *ɪᴛsᴜᴋɪ ɴᴀᴋᴀɴᴏ ᴀɪ* ギ`)
      break

    case 'status':
    case 'estado':
    case 'info':
      const status = global.autotype ? '🟢 ACTIVADO' : '🔴 DESACTIVADO'
      await m.reply(`꒰⌢ ʚ˚₊‧ 📊 ꒱꒱ :: *ESTADO ACTUAL* ıllı

੭੭ ﹙ 🎀 ﹚:: *Estado de Autotype*
\`\`\`${status}\`\`\`

੭੭ ﹙ ⚡ ﹚:: *Funcionamiento*
\`\`\`Controla el efecto "escribiendo..." en todos los mensajes\`\`\`

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

‐ ダ *ɪᴛsᴜᴋɪ ɴᴀᴋᴀɴᴏ ᴀɪ* ギ`)
      break
  }
}

// Función global para manejar el autotype
global.autoTypeHandler = async (conn, m) => {
  if (global.autotype === false) return // Si está desactivado, no hacer nada
  
  try {
    // Simular efecto de escritura
    await conn.sendPresenceUpdate('composing', m.chat)
    
    // Duración aleatoria entre 1-3 segundos
    const duration = Math.floor(Math.random() * 2000) + 1000
    await new Promise(resolve => setTimeout(resolve, duration))
    
    // Dejar de escribir
    await conn.sendPresenceUpdate('paused', m.chat)
  } catch (e) {
    // Silenciar errores
  }
}

handler.help = ['autotype']
handler.tags = ['owner']
handler.command = /^(autotype|autotipo|autowrite)$/i

export default handler