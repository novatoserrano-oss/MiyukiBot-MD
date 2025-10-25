import fs from 'fs'

let handler = async (m, { text, usedPrefix, command, conn }) => {
  if (!text) {
    return conn.reply(m.chat, `> ꒰⌢ ʚ˚₊‧ 💾 ꒱꒱ :: *GUARDAR ARCHIVO* ıllı

> ੭੭ ﹙ ❌ ﹚:: *Uso incorrecto*

\`\`\`Debes proporcionar la ruta y nombre del archivo\`\`\`

*Ejemplo:*
> ${usedPrefix + command} plugins/ejemplo.js
> ${usedPrefix + command} lib/config.json

*Nota:* Responde al mensaje que contiene el código`, m, global.rcanalw)
  }

  try {
    if (!m.quoted || !m.quoted.text) {
      return conn.reply(m.chat, `> ꒰⌢ ʚ˚₊‧ 📝 ꒱꒱ :: *MENSAJE REQUERIDO* ıllı

> ੭੭ ﹙ ⚠️ ﹚:: *Debes responder a un mensaje*

\`\`\`Responde al mensaje que contiene el código o texto que deseas guardar\`\`\`

*Pasos:*
1. Responde al mensaje con el código
2. Escribe: ${usedPrefix + command} [ruta]
3. El archivo se guardará automáticamente`, m, global.rcanalw)
    }

    await m.react('💾')

    let path = `${text}`
    await fs.writeFileSync(path, m.quoted.text)

    await m.react('✅')

    return conn.reply(m.chat, `> ꒰⌢ ʚ˚₊‧ ✅ ꒱꒱ :: *ARCHIVO GUARDADO* ıllı

> ੭੭ ﹙ 📁 ﹚:: *Ubicación*
\`\`\`${path}\`\`\`

> ੭੭ ﹙ 📊﹚:: *Tamaño*
\`\`\`${m.quoted.text.length} caracteres\`\`\`

> ੭੭ ﹙ ✨ ﹚:: *Estado*
\`\`\`Archivo guardado correctamente\`\`\`

‐ ダ *ɪᴛsᴜᴋɪ ɴᴀᴋᴀɴᴏ ᴀɪ* ギ`, m, global.rcanalr)

  } catch (error) {
    await m.react('❌')
    console.error('Error al guardar archivo:', error)

    return conn.reply(m.chat, `> ꒰⌢ ʚ˚₊‧ ❌ ꒱꒱ :: *ERROR AL GUARDAR* ıllı

> ੭੭ ﹙ ⚠️ ﹚:: *Error detectado*

\`\`\`${error.message || 'Error desconocido'}\`\`\`

*Posibles causas:*
• Ruta incorrecta
• Permisos insuficientes
• Carpeta no existe

*Solución:*
• Verifica que la ruta sea correcta
• Asegúrate de que la carpeta exista`, m, global.rcanalx)
  }
}

handler.tags = ['owner']
handler.help = ['guardar']
handler.command = ['guardar', 'save', 'savefile']
handler.rowner = true

export default handler