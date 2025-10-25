// rpg-nk-ia.js - SISTEMA RPG COMPLETO ITSUNI-NK
let handler = async (m, { conn, text, usedPrefix, command, isOwner, mentionedJid }) => {
    const ctxErr = global.rcanalx || {}
    const ctxWarn = global.rcanalw || {}
    const ctxOk = global.rcanalr || {}

    // INICIALIZAR SISTEMA RPG
    if (!global.nkRPG) {
        global.nkRPG = {
            users: {},
            batallas: {},
            misiones: {},
            recompensas: {},
            razas: {
                'Humano': { 
                    vida: 10, ataque: 8, defensa: 7, energia: 6,
                    habilidad: 'Adaptabilidad - +10% EXP en todas las actividades',
                    emoji: '👨‍🚀',
                    descripcion: 'Versátil y adaptable, los humanos sobresalen en cualquier situación'
                },
                'Elfo': { 
                    vida: 7, ataque: 9, defensa: 6, energia: 9,
                    habilidad: 'Precisión Élfica - +15% de daño crítico',
                    emoji: '🧝‍♂️',
                    descripcion: 'Graceful y preciso, los elfos son maestros del arco y la magia'
                },
                'Mago': { 
                    vida: 6, ataque: 12, defensa: 5, energia: 10,
                    habilidad: 'Poder Arcano - +20% de daño mágico',
                    emoji: '🔮',
                    descripcion: 'Sabios y poderosos, los magos dominan las artes arcanas'
                },
                'Brujo': { 
                    vida: 8, ataque: 10, defensa: 8, energia: 8,
                    habilidad: 'Alquimia Oscura - +15% de vida al usar pociones',
                    emoji: '🧙‍♂️',
                    descripcion: 'Misteriosos y astutos, los brujos manipulan la alquimia oscura'
                },
                'Demonio': { 
                    vida: 12, ataque: 11, defensa: 9, energia: 7,
                    habilidad: 'Furia Infernal - +25% de daño cuando vida < 30%',
                    emoji: '😈',
                    descripcion: 'Poderosos y temibles, los demonios desatan furia infernal'
                }
            },
            objetos: {
                armas: {
                    'Espada Básica': { ataque: 15, precio: 100, tipo: 'fisica', emoji: '⚔️' },
                    'Bastón Mágico': { ataque: 25, precio: 300, tipo: 'magica', emoji: '🪄' },
                    'Arco de Itsuki': { ataque: 35, precio: 500, tipo: 'fisica', emoji: '🏹' },
                    'Grimorio Oscuro': { ataque: 40, precio: 700, tipo: 'magica', emoji: '📖' },
                    'Guadaña Demoníaca': { ataque: 45, precio: 900, tipo: 'demoníaca', emoji: '⚰️' }
                },
                armaduras: {
                    'Túnica Básica': { defensa: 10, precio: 80, emoji: '👕' },
                    'Armadura de Acero': { defensa: 20, precio: 250, emoji: '🛡️' },
                    'Manto de Itsuki': { defensa: 30, precio: 400, emoji: '🧥' },
                    'Túnica Élfica': { defensa: 25, precio: 350, emoji: '🎯' },
                    'Armadura Demoníaca': { defensa: 35, precio: 600, emoji: '🔥' }
                },
                consumibles: {
                    'Poción de Vida': { vida: 50, precio: 50, emoji: '❤️' },
                    'Poción de Energía': { energia: 30, precio: 40, emoji: '⚡' },
                    'Onigiri Mágico': { vida: 100, energia: 50, precio: 100, emoji: '🍙' },
                    'Elixir de Fuerza': { ataque: 10, duracion: 3, precio: 150, emoji: '💪' },
                    'Poción de Defensa': { defensa: 8, duracion: 3, precio: 120, emoji: '🛡️' }
                }
            }
        }
    }

    // INICIALIZAR USUARIO
    if (!global.nkRPG.users[m.sender]) {
        global.nkRPG.users[m.sender] = {
            // PROGRESIÓN
            nivel: 1,
            exp: 0,
            expNecesaria: 100,
            puntos: 0,

            // RAZA Y CLASE
            raza: 'Humano',
            clase: 'Novato',
            titulo: 'Estudiante Primerizo',

            // STATS BASE
            stats: {
                vida: 100,
                vidaMax: 100,
                energia: 50,
                energiaMax: 50,
                ataque: 10,
                defensa: 10,
                velocidad: 5
            },

            // EQUIPAMIENTO
            equipo: {
                arma: null,
                armadura: null
            },

            // INVENTARIO
            inventario: {
                'Poción de Vida': 3,
                'Poción de Energía': 2
            },

            // BATALLAS
            victorias: 0,
            derrotas: 0,
            misionesCompletadas: 0,

            // ECONOMÍA
            coin: 1000,

            // RECOMPENSAS
            recompensasRecibidas: [],
            ultimaRecompensa: 0
        }
    }

    const user = global.nkRPG.users[m.sender]
    const userName = conn.getName(m.sender) || 'Aventurero'
    const args = text ? text.split(' ') : []
    const subCommand = args[0]?.toLowerCase()

    // 🎯 COMANDO PRINCIPAL: nkrpg
    if (command === 'nkrpg' || command === 'rpgitsuki' || command === 'nkia') {
        if (!subCommand) {
            return mostrarMenuPrincipal()
        }

        // 📊 PERFIL RPG
        if (subCommand === 'perfil' || subCommand === 'profile') {
            return mostrarPerfil()
        }

        // ⚔️ BATALLA PVP
        if (subCommand === 'batalla' || subCommand === 'battle') {
            return iniciarBatalla()
        }

        // 🎒 INVENTARIO
        if (subCommand === 'inventario' || subCommand === 'inventory') {
            return mostrarInventario()
        }

        // 🏪 TIENDA
        if (subCommand === 'tienda' || subCommand === 'shop') {
            return mostrarTienda()
        }

        // 📜 MISIONES
        if (subCommand === 'misiones' || subCommand === 'quests') {
            return mostrarMisiones()
        }

        // 🎮 ENTRENAR
        if (subCommand === 'entrenar' || subCommand === 'train') {
            return entrenar()
        }

        // 👤 RAZAS
        if (subCommand === 'razas' || subCommand === 'races') {
            return mostrarRazas()
        }

        // 🎁 RECOMPENSA
        if (subCommand === 'recompensa' || subCommand === 'reward') {
            return reclamarRecompensa()
        }
    }

    // 🧬 COMANDO ELEGIR RAZA
    if (command === 'elegirraza' || command === 'selectrace') {
        return elegirRaza(text)
    }

    // 🛍️ COMANDO COMPRAR
    if (command === 'comprar' || command === 'buy') {
        return comprarObjeto(text)
    }

    // FUNCIONES PRINCIPALES
    async function mostrarMenuPrincipal() {
        const progreso = Math.min((user.exp / user.expNecesaria) * 100, 100)
        const barra = '█'.repeat(Math.floor(progreso / 10)) + '░'.repeat(10 - Math.floor(progreso / 10))
        const razaInfo = global.nkRPG.razas[user.raza]

        const menu = 
`╭━━━〔 🏰 𝐌𝐄𝐍𝐔 𝐏𝐑𝐈𝐍𝐂𝐈𝐏𝐀𝐋 𝐑𝐏𝐆 〕━━━⬣
│ 👤 *Aventurero:* ${userName}
│ ${razaInfo.emoji} *Raza:* ${user.raza}
│ ⚔️ *Clase:* ${user.clase}
│ 🏷️ *Título:* ${user.titulo}
│ ⭐ *Nivel:* ${user.nivel}
│ 📊 *EXP:* [${barra}] ${progreso.toFixed(1)}%
│ 
│ ❤️ *Vida:* ${user.stats.vida}/${user.stats.vidaMax}
│ ⚡ *Energía:* ${user.stats.energia}/${user.stats.energiaMax}
│ 🗡️ *Ataque:* ${user.stats.ataque}
│ 🛡️ *Defensa:* ${user.stats.defensa}
│ 
│ ⚔️ *Batallas:* ${user.victorias}🏆 ${user.derrotas}💀
│ 📜 *Misiones:* ${user.misionesCompletadas}
│ 💰 *Yenes:* ${user.coin}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

╭━━━〔 🎮 𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 𝐃𝐈𝐒𝐏𝐎𝐍𝐈𝐁𝐋𝐄𝐒 〕━━━⬣
│ 
│ ⚔️ *Batalla:* ${usedPrefix}nkrpg batalla @usuario
│ 
│ 📊 *Información:*
│ • ${usedPrefix}nkrpg perfil
│ • ${usedPrefix}nkrpg inventario
│ • ${usedPrefix}nkrpg misiones
│ 
│ 🏪 *Economía:*
│ • ${usedPrefix}nkrpg tienda
│ • ${usedPrefix}comprar <objeto>
│ • ${usedPrefix}nkrpg recompensa
│ 
│ 🧬 *Desarrollo:*
│ • ${usedPrefix}nkrpg razas
│ • ${usedPrefix}elegirraza <raza>
│ • ${usedPrefix}nkrpg entrenar
│ 
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌠 *¡Que tu aventura esté llena de gloria!* ✨`

        return conn.reply(m.chat, menu, m, ctxOk)
    }

    async function mostrarPerfil() {
        const armamento = user.equipo.arma ? `🗡️ ${user.equipo.arma}` : '⚔️ Sin arma'
        const proteccion = user.equipo.armadura ? `🛡️ ${user.equipo.armadura}` : '👕 Sin armadura'
        const razaInfo = global.nkRPG.razas[user.raza]
        const progreso = Math.min((user.exp / user.expNecesaria) * 100, 100)
        const barra = '█'.repeat(Math.floor(progreso / 10)) + '░'.repeat(10 - Math.floor(progreso / 10))

        const perfil = 
`╭━━━〔 📋 𝐏𝐄𝐑𝐅𝐈𝐋 𝐃𝐄𝐋 𝐇𝐄𝐑𝐎𝐄 〕━━━⬣
│ 👤 *Aventurero:* ${userName}
│ ${razaInfo.emoji} *Raza:* ${user.raza}
│ ⭐ *Nivel:* ${user.nivel}
│ 📊 *EXP:* [${barra}] ${user.exp}/${user.expNecesaria}
│ ⚔️ *Clase:* ${user.clase}
│ 🏷️ *Título:* ${user.titulo}
│ 
│ 💫 *Habilidad Especial:*
│ ${razaInfo.habilidad}
│ 
│ ⚔️ *Equipamiento:*
│ ${armamento}
│ ${proteccion}
│ 
│ ❤️ *Estadísticas:*
│ ❤️ Vida: ${user.stats.vida}/${user.stats.vidaMax}
│ ⚡ Energía: ${user.stats.energia}/${user.stats.energiaMax}
│ 🗡️ Ataque: ${user.stats.ataque}
│ 🛡️ Defensa: ${user.stats.defensa}
│ 🏃 Velocidad: ${user.stats.velocidad}
│ 
│ 📈 *Puntos Disponibles:* ${user.puntos}
│ 💰 *Yenes:* ${user.coin}
│ 
│ ⚔️ *Récord:* ${user.victorias}🏆 ${user.derrotas}💀
│ 📜 *Misiones:* ${user.misionesCompletadas}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

${razaInfo.descripcion}

⚡ *Usa ${usedPrefix}nkrpg entrenar para mejorar tus stats*`

        return conn.reply(m.chat, perfil, m, ctxOk)
    }

    async function mostrarRazas() {
        const razas = 
`╭━━━〔 🧬 𝐒𝐄𝐋𝐄𝐂𝐂𝐈𝐎𝐍 𝐃𝐄 𝐑𝐀𝐙𝐀𝐒 〕━━━⬣
│ 
│ ${global.nkRPG.razas['Humano'].emoji} *HUMANO*
│ ${global.nkRPG.razas['Humano'].descripcion}
│ ❤️ Vida: +10 | 🗡️ Ataque: +8
│ 🛡️ Defensa: +7 | ⚡ Energía: +6
│ 💫 *Habilidad:* ${global.nkRPG.razas['Humano'].habilidad}
│ 
│ ${global.nkRPG.razas['Elfo'].emoji} *ELFO*
│ ${global.nkRPG.razas['Elfo'].descripcion}
│ ❤️ Vida: +7 | 🗡️ Ataque: +9
│ 🛡️ Defensa: +6 | ⚡ Energía: +9
│ 💫 *Habilidad:* ${global.nkRPG.razas['Elfo'].habilidad}
│ 
│ ${global.nkRPG.razas['Mago'].emoji} *MAGO*
│ ${global.nkRPG.razas['Mago'].descripcion}
│ ❤️ Vida: +6 | 🗡️ Ataque: +12
│ 🛡️ Defensa: +5 | ⚡ Energía: +10
│ 💫 *Habilidad:* ${global.nkRPG.razas['Mago'].habilidad}
│ 
│ ${global.nkRPG.razas['Brujo'].emoji} *BRUJO*
│ ${global.nkRPG.razas['Brujo'].descripcion}
│ ❤️ Vida: +8 | 🗡️ Ataque: +10
│ 🛡️ Defensa: +8 | ⚡ Energía: +8
│ 💫 *Habilidad:* ${global.nkRPG.razas['Brujo'].habilidad}
│ 
│ ${global.nkRPG.razas['Demonio'].emoji} *DEMONIO*
│ ${global.nkRPG.razas['Demonio'].descripcion}
│ ❤️ Vida: +12 | 🗡️ Ataque: +11
│ 🛡️ Defensa: +9 | ⚡ Energía: +7
│ 💫 *Habilidad:* ${global.nkRPG.razas['Demonio'].habilidad}
│ 
╰━━━━━━━━━━━━━━━━━━━━━━⬣

╭━━━〔 🎮 𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 〕━━━⬣
│ 
│ 📝 *Usa:* ${usedPrefix}elegirraza <nombre>
│ 
│ 🎯 *Ejemplos:*
│ • ${usedPrefix}elegirraza humano
│ • ${usedPrefix}elegirraza elfo
│ • ${usedPrefix}elegirraza mago
│ • ${usedPrefix}elegirraza brujo
│ • ${usedPrefix}elegirraza demonio
│ 
│ 💡 *Solo disponible en nivel 1*
│ 
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🌌 *¡Elige sabiamente, aventurero!* ✨`

        return conn.reply(m.chat, razas, m, ctxOk)
    }

    async function mostrarTienda() {
        const tienda = 
`╭━━━〔 🏪 𝐓𝐈𝐄𝐍𝐃𝐀 𝐌𝐀𝐆𝐈𝐂𝐀 〕━━━⬣
│ 👤 *Jugador:* ${userName}
│ ${global.nkRPG.razas[user.raza].emoji} *Raza:* ${user.raza}
│ 💰 *Yenes:* ${user.coin}
│ 
│ ${global.nkRPG.objetos.armas['Espada Básica'].emoji} *ARMAS*
${Object.entries(global.nkRPG.objetos.armas).map(([nombre, stats]) => 
    `│ ${stats.emoji} *${nombre}*
│ 🗡️ Ataque: +${stats.ataque} | 🎯 Tipo: ${stats.tipo}
│ 💰 Precio: ${stats.precio}¥
│`
).join('\n')}
│ 
│ ${global.nkRPG.objetos.armaduras['Armadura de Acero'].emoji} *ARMADURAS*
${Object.entries(global.nkRPG.objetos.armaduras).map(([nombre, stats]) => 
    `│ ${stats.emoji} *${nombre}*
│ 🛡️ Defensa: +${stats.defensa}
│ 💰 Precio: ${stats.precio}¥
│`
).join('\n')}
│ 
│ ${global.nkRPG.objetos.consumibles['Poción de Vida'].emoji} *CONSUMIBLES*
${Object.entries(global.nkRPG.objetos.consumibles).map(([nombre, stats]) => 
    `│ ${stats.emoji} *${nombre}*
│ ❤️ Vida: +${stats.vida || 0} | ⚡ Energía: +${stats.energia || 0}
│ 🗡️ Ataque: +${stats.ataque || 0} | 🛡️ Defensa: +${stats.defensa || 0}
│ 💰 Precio: ${stats.precio}¥
│`
).join('\n')}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

╭━━━〔 🛍️ 𝐂𝐎𝐌𝐏𝐑𝐀𝐑 〕━━━⬣
│ 
│ 📝 *Usa:* ${usedPrefix}comprar <objeto>
│ 
│ 🎯 *Ejemplos:*
│ • ${usedPrefix}comprar espada
│ • ${usedPrefix}comprar baston
│ • ${usedPrefix}comprar pocionvida
│ • ${usedPrefix}comprar armadura
│ 
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🏰 *¡Que encuentres lo que buscas!* ✨`

        return conn.reply(m.chat, tienda, m, ctxOk)
    }

    async function iniciarBatalla() {
        const mencionado = m.mentionedJid?.[0]

        if (!mencionado) {
            return conn.reply(m.chat,
`╭━━━〔 ⚔️ 𝐁𝐀𝐓𝐀𝐋𝐋𝐀 𝐏𝐕𝐏 〕━━━⬣
│ ❌ *Debes mencionar a un jugador*
│ 
│ 📝 *Uso:*
│ ${usedPrefix}nkrpg batalla @usuario
│ 
│ 💡 *Ejemplo:*
│ ${usedPrefix}nkrpg batalla @${m.sender.split('@')[0]}
│ 
│ ⚠️ *Requisitos:*
│ • Ambos deben tener energía
│ • No puedes batallar contigo mismo
╰━━━━━━━━━━━━━━━━━━━━━━⬣`, m, ctxWarn)
        }

        if (mencionado === m.sender) {
            return conn.reply(m.chat, '❌ *No puedes batallar contra ti mismo*', m, ctxErr)
        }

        // Verificar si el objetivo existe en el RPG
        if (!global.nkRPG.users[mencionado]) {
            return conn.reply(m.chat, '❌ *El usuario mencionado no está registrado en el RPG*', m, ctxErr)
        }

        const objetivo = global.nkRPG.users[mencionado]
        const nombreObjetivo = conn.getName(mencionado) || 'Oponente'

        // Verificar energía
        if (user.stats.energia < 10) {
            return conn.reply(m.chat, '❌ *No tienes suficiente energía para batallar*', m, ctxErr)
        }

        if (objetivo.stats.energia < 10) {
            return conn.reply(m.chat, `❌ *${nombreObjetivo} no tiene suficiente energía*`, m, ctxErr)
        }

        // Iniciar batalla
        user.stats.energia -= 10
        objetivo.stats.energia -= 10

        // Calcular daño con bonus de raza
        let dañoJugador = Math.max(1, user.stats.ataque - objetivo.stats.defensa / 2)
        let dañoObjetivo = Math.max(1, objetivo.stats.ataque - user.stats.defensa / 2)

        // Aplicar habilidades de raza
        if (user.raza === 'Elfo' && Math.random() < 0.15) {
            dañoJugador = Math.floor(dañoJugador * 1.15)
        }
        if (objetivo.raza === 'Elfo' && Math.random() < 0.15) {
            dañoObjetivo = Math.floor(dañoObjetivo * 1.15)
        }

        // Determinar ganador
        let ganador = user
        let perdedor = objetivo
        let nombreGanador = userName
        let nombrePerdedor = nombreObjetivo

        if (Math.random() < 0.4) { // 40% de chance para el objetivo
            ganador = objetivo
            perdedor = user
            nombreGanador = nombreObjetivo
            nombrePerdedor = userName
        }

        // Actualizar records
        ganador.victorias++
        perdedor.derrotas++

        // Recompensas
        const expGanada = 25
        const yenesGanados = 50

        ganador.exp += expGanada
        user.exp += expGanada // Ambos ganan EXP
        ganador.coin += yenesGanados

        // Bonus de humano
        if (user.raza === 'Humano') {
            user.exp += Math.floor(expGanada * 0.1)
        }
        if (objetivo.raza === 'Humano') {
            objetivo.exp += Math.floor(expGanada * 0.1)
        }

        // Verificar subida de nivel
        await verificarNivel(ganador)
        await verificarNivel(user)

        const resultadoBatalla = 
`╭━━━〔 ⚔️ 𝐁𝐀𝐓𝐀𝐋𝐋𝐀 𝐅𝐈𝐍𝐀𝐋𝐈𝐙𝐀𝐃𝐀 〕━━━⬣
│ ⚔️ *Combatientes:*
│ 🎯 ${userName} (${user.raza})
│ 🎯 ${nombreObjetivo} (${objetivo.raza})
│ 
│ 💥 *Daños Infligidos:*
│ 🗡️ ${userName}: ${dañoJugador} de daño
│ 🗡️ ${nombreObjetivo}: ${dañoObjetivo} de daño
│ 
│ 🏆 *Ganador:* ${nombreGanador}
│ 💀 *Perdedor:* ${nombrePerdedor}
│ 
│ 🎁 *Recompensas:*
│ ⭐ EXP: +${expGanada} para ambos
│ 💰 Yenes: +${yenesGanados} para ${nombreGanador}
│ ⚡ Energía: -10 para ambos
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🔥 *¡Batalla épica finalizada!* ✨`

        return conn.reply(m.chat, resultadoBatalla, m, ctxOk)
    }

    async function mostrarInventario() {
        let inventarioTexto = '🎒 *INVENTARIO VACÍO*'

        const items = Object.entries(user.inventario).filter(([_, cantidad]) => cantidad > 0)
        if (items.length > 0) {
            inventarioTexto = items.map(([item, cantidad]) => 
                `│ • ${item} x${cantidad}`
            ).join('\n')
        }

        const inventario = 
`╭━━━〔 🎒 𝐈𝐍𝐕𝐄𝐍𝐓𝐀𝐑𝐈𝐎 〕━━━⬣
│ 👤 *Jugador:* ${userName}
│ ${global.nkRPG.razas[user.raza].emoji} *Raza:* ${user.raza}
│ 
│ 📦 *Objetos:*
${inventarioTexto}
│ 
│ ⚔️ *Equipado:*
│ 🗡️ Arma: ${user.equipo.arma || 'Ninguna'}
│ 🛡️ Armadura: ${user.equipo.armadura || 'Ninguna'}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

💡 *Usa ${usedPrefix}nkrpg tienda para comprar objetos*`

        return conn.reply(m.chat, inventario, m, ctxOk)
    }

    async function mostrarMisiones() {
        const misiones = 
`╭━━━〔 📜 𝐌𝐈𝐒𝐈𝐎𝐍𝐄𝐒 〕━━━⬣
│ 👤 *Aventurero:* ${userName}
│ ${global.nkRPG.razas[user.raza].emoji} *Raza:* ${user.raza}
│ 📜 *Completadas:* ${user.misionesCompletadas}
│ 
│ 🎯 *Misiones Disponibles:*
│ 
│ 🌟 *Misión Diaria:*
│ • Batallar 3 veces
│ • Recompensa: 100 EXP, 50¥
│ 
│ ⚔️ *Misión de Combate:*
│ • Ganar 5 batallas
│ • Recompensa: 200 EXP, 100¥
│ 
│ 📈 *Misión de Nivel:*
│ • Alcanzar nivel 10
│ • Recompensa: 500 EXP, Arma especial
│ 
│ 🎪 *Misión Especial:*
│ • Completar todas las misiones diarias
│ • Recompensa: Título exclusivo
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🤗 *¡Itsuki tiene misiones especiales para ti!* ✨️`

        return conn.reply(m.chat, misiones, m, ctxOk)
    }

    async function entrenar() {
        if (user.stats.energia < 5) {
            return conn.reply(m.chat, '❌ *No tienes suficiente energía para entrenar*', m, ctxErr)
        }

        user.stats.energia -= 5
        let expGanada = 10 + Math.floor(Math.random() * 10)

        // Bonus de humano
        if (user.raza === 'Humano') {
            expGanada = Math.floor(expGanada * 1.1)
        }

        user.exp += expGanada

        // Posibilidad de ganar puntos de stat
        let mensajeExtra = ''
        if (Math.random() < 0.3) { // 30% de chance
            user.puntos += 1
            mensajeExtra = '\n│ 🎁 *¡+1 Punto de Stat!*'
        }

        await verificarNivel(user)

        const entrenamiento = 
`╭━━━〔 ⚡️ 𝐄𝐍𝐓𝐑𝐄𝐍𝐀𝐌𝐈𝐄𝐍𝐓𝐎 〕━━━⬣
│ 👤 *Entrenando:* ${userName}
│ ${global.nkRPG.razas[user.raza].emoji} *Raza:* ${user.raza}
│ 
│ 📈 *Resultados:*
│ ⭐ EXP: +${expGanada}
│ ⚡ Energía: -5
│ ${mensajeExtra}
│ 
│ 📊 *Progreso:*
│ Nivel: ${user.nivel}
│ EXP: ${user.exp}/${user.expNecesaria}
│ Puntos: ${user.puntos}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🤗 *¡Itsuki está orgullosa de tu dedicación!* ✨️`

        return conn.reply(m.chat, entrenamiento, m, ctxOk)
    }

    async function reclamarRecompensa() {
        const ahora = Date.now()
        const ultimaRecompensa = user.ultimaRecompensa || 0
        const tiempoEspera = 24 * 60 * 60 * 1000 // 24 horas

        if (ahora - ultimaRecompensa < tiempoEspera) {
            const tiempoRestante = tiempoEspera - (ahora - ultimaRecompensa)
            const horasRestantes = Math.floor(tiempoRestante / (60 * 60 * 1000))
            const minutosRestantes = Math.floor((tiempoRestante % (60 * 60 * 1000)) / (60 * 1000))

            return conn.reply(m.chat,
`╭━━━〔 🎁 𝐑𝐄𝐂𝐎𝐌𝐏𝐄𝐍𝐒𝐀 𝐃𝐈𝐀𝐑𝐈𝐀 〕━━━⬣
│ ❌ *Ya reclamaste tu recompensa hoy*
│ 
│ ⏰ *Tiempo restante:*
│ ${horasRestantes} horas ${minutosRestantes} minutos
│ 
│ 💡 *Vuelve mañana para recibir:*
│ • Monedas aleatorias
│ • EXP extra
│ • Objetos especiales
│ • Pociones de energía
╰━━━━━━━━━━━━━━━━━━━━━━⬣`, m, ctxWarn)
        }

        // Generar recompensa aleatoria
        const recompensas = [
            { tipo: 'coin', cantidad: Math.floor(Math.random() * 200) + 100, nombre: 'Yenes' },
            { tipo: 'exp', cantidad: Math.floor(Math.random() * 50) + 30, nombre: 'EXP' },
            { tipo: 'objeto', cantidad: 1, nombre: 'Poción de Vida' },
            { tipo: 'objeto', cantidad: 1, nombre: 'Poción de Energía' },
            { tipo: 'coin', cantidad: Math.floor(Math.random() * 300) + 150, nombre: 'Yenes' }
        ]

        const recompensa = recompensas[Math.floor(Math.random() * recompensas.length)]
        
        // Aplicar recompensa
        let mensajeRecompensa = ''
        switch (recompensa.tipo) {
            case 'coin':
                user.coin += recompensa.cantidad
                mensajeRecompensa = `💰 *${recompensa.cantidad} ${recompensa.nombre}*`
                break
            case 'exp':
                user.exp += recompensa.cantidad
                mensajeRecompensa = `⭐ *${recompensa.cantidad} ${recompensa.nombre}*`
                break
            case 'objeto':
                if (!user.inventario[recompensa.nombre]) {
                    user.inventario[recompensa.nombre] = 0
                }
                user.inventario[recompensa.nombre] += recompensa.cantidad
                mensajeRecompensa = `🎁 *${recompensa.nombre} x${recompensa.cantidad}*`
                break
        }

        // Bonus por raza
        let bonus = ''
        if (user.raza === 'Humano') {
            const bonusExp = Math.floor(recompensa.cantidad * 0.1)
            user.exp += bonusExp
            bonus = `\n│ 🧬 *Bonus Humano:* +${bonusExp} EXP`
        }

        user.ultimaRecompensa = ahora
        user.recompensasRecibidas.push({
            tipo: recompensa.tipo,
            cantidad: recompensa.cantidad,
            fecha: ahora
        })

        await verificarNivel(user)

        const recompensaMsg = 
`╭━━━〔 🎁 𝐑𝐄𝐂𝐎𝐌𝐏𝐄𝐍𝐒𝐀 𝐃𝐈𝐀𝐑𝐈𝐀 〕━━━⬣
│ 👤 *Jugador:* ${userName}
│ ${global.nkRPG.razas[user.raza].emoji} *Raza:* ${user.raza}
│ 
│ 🎊 *¡Recompensa Recibida!*
│ ${mensajeRecompensa}${bonus}
│ 
│ 📦 *Inventario Actual:*
│ 💰 Yenes: ${user.coin}
│ ⭐ EXP: ${user.exp}/${user.expNecesaria}
│ 🎒 Objetos: ${Object.keys(user.inventario).length}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🤗 *¡Vuelve mañana por más recompensas!* ✨️`

        return conn.reply(m.chat, recompensaMsg, m, ctxOk)
    }

    // FUNCIÓN AUXILIAR: Verificar nivel
    async function verificarNivel(jugador) {
        while (jugador.exp >= jugador.expNecesaria) {
            jugador.exp -= jugador.expNecesaria
            jugador.nivel++
            jugador.expNecesaria = Math.floor(jugador.expNecesaria * 1.5)
            jugador.puntos += 2

            // Mejorar stats al subir de nivel
            jugador.stats.vidaMax += 10
            jugador.stats.energiaMax += 5
            jugador.stats.ataque += 2
            jugador.stats.defensa += 1

            // Restaurar stats
            jugador.stats.vida = jugador.stats.vidaMax
            jugador.stats.energia = jugador.stats.energiaMax

            // Actualizar clase y título
            if (jugador.nivel >= 10) jugador.clase = 'Experto'
            if (jugador.nivel >= 25) jugador.clase = 'Maestro'
            if (jugador.nivel >= 50) jugador.clase = 'Leyenda'
        }
    }

    async function elegirRaza(razaTexto) {
        if (!razaTexto) {
            return conn.reply(m.chat,
`╭━━━〔 🧬 𝐄𝐋𝐄𝐆𝐈𝐑 𝐑𝐀𝐙𝐀 〕━━━⬣
│ ❌ *Debes especificar una raza*
│ 
│ 📝 *Uso:*
│ ${usedPrefix}elegirraza <raza>
│ 
│ 🎯 *Razas disponibles:*
│ • humano
│ • elfo
│ • mago
│ • brujo
│ • demonio
│ 
│ 💡 *Solo disponible en nivel 1*
╰━━━━━━━━━━━━━━━━━━━━━━⬣`, m, ctxWarn)
        }

        if (user.nivel > 1) {
            return conn.reply(m.chat, '❌ *Solo puedes elegir raza en nivel 1*', m, ctxErr)
        }

        const raza = razaTexto.toLowerCase()
        const razasDisponibles = {
            'humano': 'Humano',
            'elfo': 'Elfo', 
            'mago': 'Mago',
            'brujo': 'Brujo',
            'demonio': 'Demonio'
        }

        if (!razasDisponibles[raza]) {
            return conn.reply(m.chat, '❌ *Raza no válida. Usa:* ' + usedPrefix + 'nkrpg razas *para ver las razas disponibles*', m, ctxErr)
        }

        const razaElegida = razasDisponibles[raza]
        const statsRaza = global.nkRPG.razas[razaElegida]

        // Aplicar stats de la raza
        user.raza = razaElegida
        user.stats.vidaMax += statsRaza.vida
        user.stats.vida = user.stats.vidaMax
        user.stats.ataque += statsRaza.ataque
        user.stats.defensa += statsRaza.defensa
        user.stats.energiaMax += statsRaza.energia
        user.stats.energia = user.stats.energiaMax

        return conn.reply(m.chat,
`╭━━━〔 🧬 𝐑𝐀𝐙𝐀 𝐄𝐋𝐄𝐆𝐈𝐃𝐀 〕━━━⬣
│ 🎉 *¡Felicidades!*
│ 🧬 *Raza seleccionada:* ${razaElegida}
│ 
│ 📊 *Bonus de Raza:*
│ ❤️ Vida: +${statsRaza.vida}
│ 🗡️ Ataque: +${statsRaza.ataque}
│ 🛡️ Defensa: +${statsRaza.defensa}
│ ⚡ Energía: +${statsRaza.energia}
│ 
│ 💫 *Habilidad Especial:*
│ ${statsRaza.habilidad}
│ 
│ 🎯 *¡Comienza tu aventura!*
╰━━━━━━━━━━━━━━━━━━━━━━⬣`, m, ctxOk)
    }

    async function comprarObjeto(objetoTexto) {
        if (!objetoTexto) {
            return conn.reply(m.chat,
`╭━━━〔 🛍️ 𝐂𝐎𝐌𝐏𝐑𝐀𝐑 𝐎𝐁𝐉𝐄𝐓𝐎𝐒 〕━━━⬣
│ ❌ *Debes especificar un objeto*
│ 
│ 📝 *Uso:*
│ ${usedPrefix}comprar <objeto>
│ 
│ 🎯 *Objetos disponibles:*
│ • espada
│ • baston
│ • arco
│ • grimorio
│ • guadaña
│ • tunica
│ • armadura
│ • manto
│ • tunicaelfica
│ • armadurademonio
│ • pocionvida
│ • pocionenergia
│ • onigiri
│ • elixir
│ • pociondefensa
│ 
│ 💡 *Usa:* ${usedPrefix}nkrpg tienda
│ *Para ver precios*
╰━━━━━━━━━━━━━━━━━━━━━━⬣`, m, ctxWarn)
        }

        const objeto = objetoTexto.toLowerCase()
        const objetosDisponibles = {
            // Armas
            'espada': 'Espada Básica',
            'baston': 'Bastón Mágico',
            'arco': 'Arco de Itsuki',
            'grimorio': 'Grimorio Oscuro',
            'guadaña': 'Guadaña Demoníaca',
            
            // Armaduras
            'tunica': 'Túnica Básica',
            'armadura': 'Armadura de Acero',
            'manto': 'Manto de Itsuki',
            'tunicaelfica': 'Túnica Élfica',
            'armadurademonio': 'Armadura Demoníaca',
            
            // Consumibles
            'pocionvida': 'Poción de Vida',
            'pocionenergia': 'Poción de Energía',
            'onigiri': 'Onigiri Mágico',
            'elixir': 'Elixir de Fuerza',
            'pociondefensa': 'Poción de Defensa'
        }

        if (!objetosDisponibles[objeto]) {
            return conn.reply(m.chat, '❌ *Objeto no encontrado. Usa:* ' + usedPrefix + 'nkrpg tienda *para ver objetos disponibles*', m, ctxErr)
        }

        const nombreObjeto = objetosDisponibles[objeto]
        let statsObjeto = null
        let tipo = ''

        // Buscar en armas
        if (global.nkRPG.objetos.armas[nombreObjeto]) {
            statsObjeto = global.nkRPG.objetos.armas[nombreObjeto]
            tipo = 'arma'
        }
        // Buscar en armaduras
        else if (global.nkRPG.objetos.armaduras[nombreObjeto]) {
            statsObjeto = global.nkRPG.objetos.armaduras[nombreObjeto]
            tipo = 'armadura'
        }
        // Buscar en consumibles
        else if (global.nkRPG.objetos.consumibles[nombreObjeto]) {
            statsObjeto = global.nkRPG.objetos.consumibles[nombreObjeto]
            tipo = 'consumible'
        }

        if (!statsObjeto) {
            return conn.reply(m.chat, '❌ *Error al encontrar el objeto*', m, ctxErr)
        }

        // Verificar si tiene suficiente dinero
        if (user.coin < statsObjeto.precio) {
            return conn.reply(m.chat, `❌ *No tienes suficiente dinero. Necesitas ${statsObjeto.precio}¥ y tienes ${user.coin}¥*`, m, ctxErr)
        }

        // Comprar objeto
        user.coin -= statsObjeto.precio

        if (tipo === 'consumible') {
            // Agregar al inventario
            if (!user.inventario[nombreObjeto]) {
                user.inventario[nombreObjeto] = 0
            }
            user.inventario[nombreObjeto] += 1
        } else {
            // Equipar automáticamente
            if (tipo === 'arma') {
                user.equipo.arma = nombreObjeto
                user.stats.ataque += statsObjeto.ataque
            } else if (tipo === 'armadura') {
                user.equipo.armadura = nombreObjeto
                user.stats.defensa += statsObjeto.defensa
            }
        }

        let mensajeObjeto = ''
        if (tipo === 'arma') {
            mensajeObjeto = `🗡️ *Arma equipada:* ${nombreObjeto} (+${statsObjeto.ataque} ataque)`
        } else if (tipo === 'armadura') {
            mensajeObjeto = `🛡️ *Armadura equipada:* ${nombreObjeto} (+${statsObjeto.defensa} defensa)`
        } else {
            mensajeObjeto = `🎒 *Objeto agregado:* ${nombreObjeto} x1`
        }

        return conn.reply(m.chat,
`╭━━━〔 🛍️ 𝐂𝐎𝐌𝐏𝐑𝐀 𝐄𝐗𝐈𝐓𝐎𝐒𝐀 〕━━━⬣
│ 🎉 *¡Compra realizada!*
│ ${mensajeObjeto}
│ 
│ 💰 *Pago:*
│ Precio: ${statsObjeto.precio}¥
│ Saldo anterior: ${user.coin + statsObjeto.precio}¥
│ Saldo actual: ${user.coin}¥
│ 
│ 🎯 *¡Disfruta tu compra!*
╰━━━━━━━━━━━━━━━━━━━━━━⬣`, m, ctxOk)
    }
}

handler.help = ['nkrpg', 'elegirraza', 'comprar']
handler.tags = ['rpgnk']
handler.command = ['nkrpg', 'rpgitsuki', 'elegirraza', 'comprar']
handler.register = true

export default handler