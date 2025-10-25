import { promises as fs } from 'fs'

const charactersFilePath = './src/database/characters[1].json'
const cooldowns = {}
const COOLDOWN_TIME = 15 * 1000

async function loadCharacters() {
  try {
    const data = await fs.readFile(charactersFilePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    throw new Error('🧧 No se pudo cargar el archivo characters.json.')
  }
}

async function saveCharacters(characters) {
  try {
    await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error al guardar characters.json:', error)
  }
}

let handler = async (m, { conn }) => {
  const userId = m.sender
  const now = Date.now()

  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

  if (cooldowns[userId] && now < cooldowns[userId]) {
    const remainingTime = Math.ceil((cooldowns[userId] - now) / 1000)
    const minutes = Math.floor(remainingTime / 60)
    const seconds = remainingTime % 60
    await conn.reply(
      m.chat,
      `╭━━━〔 🎀 𝐂𝐎𝐎𝐋𝐃𝐎𝐖𝐍 🎀 〕━━━⬣
│ ⏰ *Tiempo de espera:*
│ ${minutes} minutos y ${seconds} segundos
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌸 *Itsuki te pide paciencia...* (´･ω･\`)`,
      m
    )
    await conn.sendMessage(m.chat, { react: { text: '❎', key: m.key } })
    return
  }

  try {
    const characters = await loadCharacters()

    let randomCharacter = null
    let attempts = 0
    while (!randomCharacter && attempts < 10) {
      const candidate = characters[Math.floor(Math.random() * characters.length)]
      if (candidate.img && candidate.img.length > 0) randomCharacter = candidate
      attempts++
    }

    if (!randomCharacter)
      throw new Error('No se encontró un personaje con imagen disponible.')

    const randomImage =
      randomCharacter.img[Math.floor(Math.random() * randomCharacter.img.length)]

    const isClaimed =
      randomCharacter.user && randomCharacter.user.trim() !== ''

    // USANDO LA MISMA MENCION QUE EL MENÚ
    const statusMessage = isClaimed
      ? `🔴 Ya reclamado por @${randomCharacter.user.split('@')[0]}`
      : '🟢 Disponible para reclamar'

    // Mensaje principal
    const message = `╭━━━〔 🌸 𝐏𝐄𝐑𝐒𝐎𝐍𝐀𝐉𝐄 𝐀𝐋𝐄𝐀𝐓𝐎𝐑𝐈𝐎 🌸 〕━━━⬣
│ 🎴 Nombre ➪ *${randomCharacter.name}*
│ ⚧️ Género ➪ *${randomCharacter.gender}*
│ 💎 Valor ➪ *${randomCharacter.value}*
│ 🎯 Estado ➪ ${statusMessage}
│ 📚 Fuente ➪ *${randomCharacter.source}*
│ 🪪 ID: *${randomCharacter.id}*
╰━━━━━━━━━━━━━━━━━━━━━━⬣

${
  !isClaimed
    ? `🍜 *¡Personaje disponible!*\n📖 *Responde con .c para reclamarlo* 🎀`
    : `📚 *Este personaje ya tiene dueño*\n🌸 *Sigue intentando para encontrar uno disponible*`
}`

    // Menciones para que funcione el tag - IGUAL QUE EN EL MENÚ
    const mentions = isClaimed ? [randomCharacter.user] : []

    await conn.sendFile(m.chat, randomImage, `${randomCharacter.name}.jpg`, message, m, {
      mentions,
      contextInfo: { 
        mentionedJid: mentions,
        // Opcional: agregar el mismo formato de newsletter si quieres
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: 'status@broadcast', 
          serverMessageId: 100, 
          newsletterName: 'Itsuki Nakano' 
        }
      }
    })

    // Reacción de éxito
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

    // Actualizar cooldown
    cooldowns[userId] = now + COOLDOWN_TIME
  } catch (error) {
    await conn.reply(
      m.chat,
      `╭━━━〔 🎀 𝐄𝐑𝐑𝐎𝐑 🎀 〕━━━⬣
│ ❌ *Error:* ${error.message}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌸 *Itsuki lo intentará de nuevo...* (´；ω；\`)`,
      m
    )
    await conn.sendMessage(m.chat, { react: { text: '❎', key: m.key } })
  }
}

handler.help = ['ver', 'rw', 'rollwaifu']
handler.tags = ['gacha']
handler.command = ['ver', 'rw', 'rollwaifu']
handler.group = true

export default handler