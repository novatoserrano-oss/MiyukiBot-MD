// rpg-nk-ia.js - SISTEMA RPG COMPLETO CON CLANES
let handler = async (m, { conn, text, usedPrefix, command, isOwner, mentionedJid }) => {
    const ctxErr = global.rcanalx || {}
    const ctxWarn = global.rcanalw || {}
    const ctxOk = global.rcanalr || {}

    // INICIALIZAR SISTEMA RPG
    if (!global.nkRPG) {
        global.nkRPG = {
            users: {},
            batallas: {},
            clanes: {}, // Clanes creados por usuarios
            clanesPredefinidos: {
                'Clan Itsuki': { 
                    miembros: [], 
                    nivel: 1, 
                    fundador: 'Itsuki-Nakano',
                    descripcion: 'Clan oficial liderado por Itsuki',
                    requisito: 'Nivel 5',
                    privado: false
                },
                'Clan Nakano': { 
                    miembros: [], 
                    nivel: 1, 
                    fundador: 'Sistema',
                    descripcion: 'Especializado en estudio y estrategia',
                    requisito: 'Nivel 10',
                    privado: true
                }
            },
            misiones: {},
            objetos: {
                armas: {
                    'Espada Básica': { ataque: 15, precio: 100 },
                    'Bastón Mágico': { ataque: 25, precio: 300 },
                    'Arco de Itsuki': { ataque: 35, precio: 500 }
                },
                armaduras: {
                    'Túnica Básica': { defensa: 10, precio: 80 },
                    'Armadura de Acero': { defensa: 20, precio: 250 },
                    'Manto de Itsuki': { defensa: 30, precio: 400 }
                },
                consumibles: {
                    'Poción de Vida': { vida: 50, precio: 50 },
                    'Poción de Energía': { energia: 30, precio: 40 },
                    'Onigiri Mágico': { vida: 100, energia: 50, precio: 100 }
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

            // CLASE Y TÍTULO
            clase: 'Novato',
            titulo: 'Estudiante Primerizo',

            // CLAN
            clan: null,
            rangoClan: null,

            // BATALLAS
            victorias: 0,
            derrotas: 0,
            misionesCompletadas: 0,

            // MONEDAS
            yenes: 100
        }
    }

    const user = global.nkRPG.users[m.sender]
    
    // FUNCIÓN SEGURA PARA OBTENER NOMBRE
    const getUserName = async (userId) => {
        try {
            const name = await conn.getName(userId)
            return name || 'Aventurero'
        } catch (e) {
            return 'Aventurero'
        }
    }

    const userName = await getUserName(m.sender)
    const args = text ? text.split(' ') : []
    const subCommand = args[0]?.toLowerCase()
    const clanCommand = args[1]?.toLowerCase()

    // 🎯 COMANDO PRINCIPAL: nkrpg
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

    // 👥 SISTEMA DE CLANES
    if (subCommand === 'clan' || subCommand === 'clanes') {
        if (!clanCommand) {
            return mostrarMenuClanes()
        }

        // CREAR CLAN
        if (clanCommand === 'crear') {
            return crearClan(args.slice(2).join(' '))
        }

        // UNIRSE A CLAN
        if (clanCommand === 'unirse') {
            return unirseClan(args.slice(2).join(' '))
        }

        // ABANDONAR CLAN
        if (clanCommand === 'abandonar') {
            return abandonarClan()
        }

        // INFO CLAN
        if (clanCommand === 'info') {
            return infoClan(args.slice(2).join(' '))
        }

        // LISTA DE CLANES
        if (clanCommand === 'lista') {
            return listaClanes()
        }

        // ADMINISTRAR CLAN (solo líderes)
        if (clanCommand === 'admin') {
            return administrarClan(args.slice(2))
        }
    }

    // 🎮 ENTRENAR
    if (subCommand === 'entrenar' || subCommand === 'train') {
        return entrenar()
    }

    // FUNCIONES PRINCIPALES
    async function mostrarMenuPrincipal() {
        const progreso = Math.min((user.exp / user.expNecesaria) * 100, 100)
        const barra = '█'.repeat(Math.floor(progreso / 10)) + '░'.repeat(10 - Math.floor(progreso / 10))

        const menu = 
`╭━━━〔 👑 𝐒𝐈𝐒𝐓𝐄𝐌𝐀 𝐍𝐊-𝐈𝐀 𝐑𝐏𝐆 🔥 〕━━━⬣
│ 👤 *Aventurero:* ${userName}
│ ⭐ *Nivel:* ${user.nivel} | ${user.clase}
│ 📊 *EXP:* [${barra}] ${progreso.toFixed(1)}%
│ 🏷️ *Título:* ${user.titulo}
│ 
│ ❤️ *Vida:* ${user.stats.vida}/${user.stats.vidaMax}
│ ⚡ *Energía:* ${user.stats.energia}/${user.stats.energiaMax}
│ 🗡️ *Ataque:* ${user.stats.ataque}
│ 🛡️ *Defensa:* ${user.stats.defensa}
│ 
│ ⚔️  *Batallas:* ${user.victorias}🏆 ${user.derrotas}💀
│ 📜 *Misiones:* ${user.misionesCompletadas}
│ 👑 *Clan:* ${user.clan || 'Sin clan'}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

🎮 *𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 𝐃𝐈𝐒𝐏𝐎𝐍𝐈𝐁𝐋𝐄𝐒:*

⚔️ *Batalla:* 
• ${usedPrefix}nkrpg batalla @usuario

📊 *Perfil:*
• ${usedPrefix}nkrpg perfil

🎒 *Inventario:*
• ${usedPrefix}nkrpg inventario

🏪 *Tienda:*
• ${usedPrefix}nkrpg tienda

📜 *Misiones:*
• ${usedPrefix}nkrpg misiones

👥 *Clanes:*
• ${usedPrefix}nkrpg clan crear <nombre>
• ${usedPrefix}nkrpg clan unirse <nombre>
• ${usedPrefix}nkrpg clan lista

🎯 *Entrenar:*
• ${usedPrefix}nkrpg entrenar

⚔️ *¡Itsuki te guiará en esta aventura!* ✨️`

        return conn.reply(m.chat, menu, m, ctxOk)
    }

    async function mostrarMenuClanes() {
        const infoClan = user.clan ? 
            `│ 👑 *Clan Actual:* ${user.clan}\n│ 🎯 *Rango:* ${user.rangoClan || 'Miembro'}` : 
            '│ ❌ *No perteneces a ningún clan*'

        const menuClanes = 
`╭━━━〔 💯 𝐒𝐈𝐒𝐓𝐄𝐌𝐀 𝐃𝐄 𝐂𝐋𝐀𝐍𝐄𝐒 👥️ 〕━━━⬣
│ 👤 *Jugador:* ${userName}
${infoClan}
│ 
📝 *𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒 𝐃𝐄 𝐂𝐋𝐀𝐍𝐄𝐒:*

🏰 *Crear Clan:*
• ${usedPrefix}nkrpg clan crear <nombre>
• Costo: 500 yenes
• Requisito: Nivel 10+

👥 *Unirse a Clan:*
• ${usedPrefix}nkrpg clan unirse <nombre>
• Algunos clanes tienen requisitos

📋 *Información:*
• ${usedPrefix}nkrpg clan info <nombre>
• ${usedPrefix}nkrpg clan lista

🚪 *Salir del Clan:*
• ${usedPrefix}nkrpg clan abandonar

🛡️ *Beneficios de Clan:*
• Bonificación de stats
• Batallas entre clanes
• Recursos compartidos
• Eventos exclusivos
╰━━━━━━━━━━━━━━━━━━━━━━⬣`

        return conn.reply(m.chat, menuClanes, m, ctxOk)
    }

    // 🏰 SISTEMA DE CREACIÓN DE CLANES
    async function crearClan(nombreClan) {
        if (!nombreClan) {
            return conn.reply(m.chat,
`╭━━━〔 🏰 𝐂𝐑𝐄𝐀𝐑 𝐂𝐋𝐀𝐍 🏰 〕━━━⬣
│ ❌ *Debes especificar un nombre*
│ 
│ 📝 *Uso:*
│ ${usedPrefix}nkrpg clan crear <nombre>
│ 
│ 💡 *Ejemplo:*
│ ${usedPrefix}nkrpg clan crear GuerrerosDragón
│ 
│ ⚠️ *Requisitos:*
│ • Nivel 10 o superior
│ • 500 yenes
│ • No pertenecer a otro clan
╰━━━━━━━━━━━━━━━━━━━━━━⬣`,
            m, ctxWarn)
        }

        // Verificar requisitos
        if (user.nivel < 10) {
            return conn.reply(m.chat,
`╭━━━〔 🏰 𝐂𝐑𝐄𝐀𝐑 𝐂𝐋𝐀𝐍 🏰 〕━━━⬣
│ ❌ *No cumples los requisitos*
│ 
│ 📊 *Tu nivel:* ${user.nivel}
│ 🎯 *Requisito:* Nivel 10
│ 📈 *Te faltan:* ${10 - user.nivel} niveles
╰━━━━━━━━━━━━━━━━━━━━━━⬣`,
            m, ctxErr)
        }

        if (user.yenes < 500) {
            return conn.reply(m.chat,
`╭━━━〔 🏰 𝐂𝐑𝐄𝐀𝐑 𝐂𝐋𝐀𝐍 🏰 〕━━━⬣
│ ❌ *Fondos insuficientes*
│ 
│ 💰 *Necesitas:* 500 yenes
│ 💵 *Tienes:* ${user.yenes} yenes
│ 📉 *Faltan:* ${500 - user.yenes} yenes
╰━━━━━━━━━━━━━━━━━━━━━━⬣`,
            m, ctxErr)
        }

        if (user.clan) {
            return conn.reply(m.chat,
`╭━━━〔 🏰 𝐂𝐑𝐄𝐀𝐑 𝐂𝐋𝐀𝐍 🏰 〕━━━⬣
│ ❌ *Ya perteneces a un clan*
│ 
│ 👑 *Clan actual:* ${user.clan}
│ 💡 *Debes abandonar tu clan actual primero*
│ 
│ 🚪 *Usa:* ${usedPrefix}nkrpg clan abandonar
╰━━━━━━━━━━━━━━━━━━━━━━⬣`,
            m, ctxErr)
        }

        // Verificar si el nombre ya existe
        if (global.nkRPG.clanes[nombreClan] || global.nkRPG.clanesPredefinidos[nombreClan]) {
            return conn.reply(m.chat,
`╭━━━〔 🏰 𝐂𝐑𝐄𝐀𝐑 𝐂𝐋𝐀𝐍 🏰 〕━━━⬣
│ ❌ *Nombre no disponible*
│ 
│ 📛 *El clan* "${nombreClan}"
│ 🚫 *Ya existe en el sistema*
│ 
│ 💡 *Elige otro nombre único*
╰━━━━━━━━━━━━━━━━━━━━━━⬣`,
            m, ctxErr)
        }

        // Crear el clan
        user.yenes -= 500
        global.nkRPG.clanes[nombreClan] = {
            fundador: m.sender,
            fundadorNombre: userName,
            miembros: [m.sender],
            nivel: 1,
            exp: 0,
            expNecesaria: 1000,
            descripcion: `Clan fundado por ${userName}`,
            requisito: 'Nivel 5',
            privado: false,
            fechaCreacion: new Date().toLocaleDateString(),
            stats: {
                ataque: 0,
                defensa: 0,
                vida: 0
            }
        }

        // Unir al fundador al clan
        user.clan = nombreClan
        user.rangoClan = 'Líder'

        return conn.reply(m.chat,
`╭━━━〔 🏰 𝐂𝐋𝐀𝐍 𝐂𝐑𝐄𝐀𝐃𝐎 🏰 〕━━━⬣
│ ✅ *¡Clan creado con éxito!*
│ 
│ 📛 *Nombre:* ${nombreClan}
│ 👑 *Fundador:* ${userName}
│ 💰 *Costo:* 500 yenes
│ 📅 *Fecha:* ${new Date().toLocaleDateString()}
│ 
│ 🎯 *Ahora eres el líder del clan*
│ 👥 *Puedes invitar a otros jugadores*
│ ⚔️ *¡Lucha por la gloria de tu clan!*
╰━━━━━━━━━━━━━━━━━━━━━━⬣

💡 *Usa:* ${usedPrefix}nkrpg clan info ${nombreClan}
*Para ver la información de tu clan*`,
        m, ctxOk)
    }

    // 👥 SISTEMA DE UNIÓN A CLANES
    async function unirseClan(nombreClan) {
        if (!nombreClan) {
            return conn.reply(m.chat,
`╭━━━〔 👥 𝐔𝐍𝐈𝐑𝐒𝐄 𝐀 𝐂𝐋𝐀𝐍 👥 〕━━━⬣
│ ❌ *Debes especificar un clan*
│ 
│ 📝 *Uso:*
│ ${usedPrefix}nkrpg clan unirse <nombre>
│ 
│ 💡 *Ejemplo:*
│ ${usedPrefix}nkrpg clan unirse ClanItsuki
│ 
│ 📋 *Usa:* ${usedPrefix}nkrpg clan lista
│ *Para ver los clanes disponibles*
╰━━━━━━━━━━━━━━━━━━━━━━⬣`,
            m, ctxWarn)
        }

        if (user.clan) {
            return conn.reply(m.chat,
`╭━━━〔 👥 𝐔𝐍𝐈𝐑𝐒𝐄 𝐀 𝐂𝐋𝐀𝐍 👥 〕━━━⬣
│ ❌ *Ya perteneces a un clan*
│ 
│ 👑 *Clan actual:* ${user.clan}
│ 💡 *Debes abandonar tu clan actual primero*
╰━━━━━━━━━━━━━━━━━━━━━━⬣`,
            m, ctxErr)
        }

        // Buscar clan en clanes predefinidos
        let clan = global.nkRPG.clanesPredefinidos[nombreClan]
        let tipoClan = 'predefinido'

        // Si no está en predefinidos, buscar en clanes de usuarios
        if (!clan) {
            clan = global.nkRPG.clanes[nombreClan]
            tipoClan = 'usuario'
        }

        if (!clan) {
            return conn.reply(m.chat,
`╭━━━〔 👥 𝐔𝐍𝐈𝐑𝐒𝐄 𝐀 𝐂𝐋𝐀𝐍 👥 〕━━━⬣
│ ❌ *Clan no encontrado*
│ 
│ 📛 *El clan* "${nombreClan}"
│ 🔍 *No existe en el sistema*
│ 
│ 📋 *Usa:* ${usedPrefix}nkrpg clan lista
│ *Para ver los clanes disponibles*
╰━━━━━━━━━━━━━━━━━━━━━━⬣`,
            m, ctxErr)
        }

        // Verificar requisitos
        if (clan.requisito) {
            const requisitoNivel = parseInt(clan.requisito.replace('Nivel ', ''))
            if (user.nivel < requisitoNivel) {
                return conn.reply(m.chat,
`╭━━━〔 👥 𝐔𝐍𝐈𝐑𝐒𝐄 𝐀 𝐂𝐋𝐀𝐍 👥 〕━━━⬣
│ ❌ *No cumples los requisitos*
│ 
│ 📛 *Clan:* ${nombreClan}
│ 🎯 *Requisito:* ${clan.requisito}
│ 📊 *Tu nivel:* ${user.nivel}
│ 📈 *Te faltan:* ${requisitoNivel - user.nivel} niveles
╰━━━━━━━━━━━━━━━━━━━━━━⬣`,
                m, ctxErr)
            }
        }

        // Verificar si el clan es privado
        if (clan.privado) {
            return conn.reply(m.chat,
`╭━━━〔 👥 𝐔𝐍𝐈𝐑𝐒𝐄 𝐀 𝐂𝐋𝐀𝐍 👥 〕━━━⬣
│ ❌ *Clan privado*
│ 
│ 📛 *Clan:* ${nombreClan}
│ 🔒 *Este clan es privado*
│ 💡 *Necesitas invitación del líder*
╰━━━━━━━━━━━━━━━━━━━━━━⬣`,
                m, ctxErr)
        }

        // Unir al usuario al clan
        clan.miembros.push(m.sender)
        user.clan = nombreClan
        user.rangoClan = 'Miembro'

        return conn.reply(m.chat,
`╭━━━〔 👥 𝐔𝐍𝐈𝐃𝐎 𝐀 𝐂𝐋𝐀𝐍 👥 〕━━━⬣
│ ✅ *¡Te has unido al clan!*
│ 
│ 📛 *Clan:* ${nombreClan}
│ 👤 *Jugador:* ${userName}
│ 🎯 *Rango:* Miembro
│ 👥 *Miembros:* ${clan.miembros.length}
│ 
│ 🏆 *¡Bienvenido al clan!*
│ ⚔️ *Lucha por la gloria de todos*
╰━━━━━━━━━━━━━━━━━━━━━━⬣`,
        m, ctxOk)
    }

    // 🚪 ABANDONAR CLAN
    async function abandonarClan() {
        if (!user.clan) {
            return conn.reply(m.chat,
`╭━━━〔 🚪 𝐀𝐁𝐀𝐍𝐃𝐎𝐍𝐀𝐑 𝐂𝐋𝐀𝐍 🚪 〕━━━⬣
│ ❌ *No perteneces a ningún clan*
│ 
│ 💡 *Usa:* ${usedPrefix}nkrpg clan unirse <nombre>
│ *Para unirte a un clan*
╰━━━━━━━━━━━━━━━━━━━━━━⬣`,
            m, ctxErr)
        }

        const nombreClan = user.clan
        let clan = global.nkRPG.clanes[nombreClan] || global.nkRPG.clanesPredefinidos[nombreClan]

        if (!clan) {
            user.clan = null
            user.rangoClan = null
            return conn.reply(m.chat, '❌ *Error: Clan no encontrado*', m, ctxErr)
        }

        // Si es el líder y es clan de usuario, eliminar el clan
        if (user.rangoClan === 'Líder' && global.nkRPG.clanes[nombreClan]) {
            delete global.nkRPG.clanes[nombreClan]
            
            // Notificar a otros miembros
            for (let miembro of clan.miembros) {
                if (miembro !== m.sender && global.nkRPG.users[miembro]) {
                    global.nkRPG.users[miembro].clan = null
                    global.nkRPG.users[miembro].rangoClan = null
                }
            }

            return conn.reply(m.chat,
`╭━━━〔 🚪 𝐂𝐋𝐀𝐍 𝐃𝐄𝐒𝐏𝐄𝐃𝐈𝐃𝐀 🚪 〕━━━⬣
│ 💔 *Has disuelto el clan*
│ 
│ 📛 *Clan:* ${nombreClan}
│ 👑 *Eras el líder*
│ 👥 *Miembros afectados:* ${clan.miembros.length - 1}
│ 
│ 🏰 *El clan ha sido eliminado*
│ 📋 *Todos los miembros han sido expulsados*
╰━━━━━━━━━━━━━━━━━━━━━━⬣`,
            m, ctxWarn)
        }

        // Remover del clan
        clan.miembros = clan.miembros.filter(miembro => miembro !== m.sender)
        user.clan = null
        user.rangoClan = null

        return conn.reply(m.chat,
`╭━━━〔 🚪 𝐀𝐁𝐀𝐍𝐃𝐎𝐍𝐀𝐑 𝐂𝐋𝐀𝐍 🚪 〕━━━⬣
│ 👋 *Has abandonado el clan*
│ 
│ 📛 *Clan:* ${nombreClan}
│ 👤 *Jugador:* ${userName}
│ 🎯 *Rango anterior:* ${user.rangoClan}
│ 
│ 🏹 *¡Buena suerte en tus aventuras!*
╰━━━━━━━━━━━━━━━━━━━━━━⬣`,
        m, ctxOk)
    }

    // 📋 LISTA DE CLANES
    async function listaClanes() {
        const clanesUsuario = Object.entries(global.nkRPG.clanes)
        const clanesPredefinidos = Object.entries(global.nkRPG.clanesPredefinidos)
        
        let listaTexto = ''

        // Clanes predefinidos
        if (clanesPredefinidos.length > 0) {
            listaTexto += `🏰 *CLANES PREDEFINIDOS:*\n\n`
            clanesPredefinidos.forEach(([nombre, clan], index) => {
                listaTexto += `📛 ${nombre}\n`
                listaTexto += `👑 Fundador: ${clan.fundador}\n`
                listaTexto += `👥 Miembros: ${clan.miembros.length}\n`
                listaTexto += `🎯 Requisito: ${clan.requisito || 'Ninguno'}\n`
                listaTexto += `🔒 ${clan.privado ? 'Privado' : 'Público'}\n`
                listaTexto += `📝 ${clan.descripcion}\n`
                if (index < clanesPredefinidos.length - 1) listaTexto += `─────────────────\n`
            })
        }

        // Clanes de usuarios
        if (clanesUsuario.length > 0) {
            listaTexto += `\n🏰 *CLANES DE USUARIOS:*\n\n`
            clanesUsuario.forEach(([nombre, clan], index) => {
                listaTexto += `📛 ${nombre}\n`
                listaTexto += `👑 Líder: ${clan.fundadorNombre}\n`
                listaTexto += `👥 Miembros: ${clan.miembros.length}\n`
                listaTexto += `⭐ Nivel: ${clan.nivel}\n`
                listaTexto += `📅 Creado: ${clan.fechaCreacion}\n`
                listaTexto += `📝 ${clan.descripcion}\n`
                if (index < clanesUsuario.length - 1) listaTexto += `─────────────────\n`
            })
        }

        if (!listaTexto) {
            listaTexto = '❌ *No hay clanes disponibles en este momento*'
        }

        return conn.reply(m.chat,
`╭━━━〔 📋 𝐋𝐈𝐒𝐓𝐀 𝐃𝐄 𝐂𝐋𝐀𝐍𝐄𝐒 📋 〕━━━⬣
${listaTexto}
╰━━━━━━━━━━━━━━━━━━━━━━⬣

💡 *Usa:* ${usedPrefix}nkrpg clan unirse <nombre>
*Para unirte a un clan*`,
        m, ctxOk)
    }

    // ℹ️ INFORMACIÓN DE CLAN
    async function infoClan(nombreClan) {
        if (!nombreClan) {
            return conn.reply(m.chat,
`╭━━━〔 ℹ️ 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂𝐈𝐎𝐍 𝐃𝐄 𝐂𝐋𝐀𝐍 ℹ️ 〕━━━⬣
│ ❌ *Debes especificar un clan*
│ 
│ 📝 *Uso:*
│ ${usedPrefix}nkrpg clan info <nombre>
│ 
│ 💡 *Ejemplo:*
│ ${usedPrefix}nkrpg clan info ClanItsuki
╰━━━━━━━━━━━━━━━━━━━━━━⬣`,
            m, ctxWarn)
        }

        let clan = global.nkRPG.clanes[nombreClan] || global.nkRPG.clanesPredefinidos[nombreClan]

        if (!clan) {
            return conn.reply(m.chat, '❌ *Clan no encontrado*', m, ctxErr)
        }

        // Obtener nombres de miembros
        const nombresMiembros = await Promise.all(
            clan.miembros.slice(0, 10).map(async (miembro) => {
                return await getUserName(miembro)
            })
        )

        const info = 
`╭━━━〔 ℹ️ 𝐈𝐍𝐅𝐎 𝐂𝐋𝐀𝐍 ℹ️ 〕━━━⬣
│ 📛 *Nombre:* ${nombreClan}
│ 👑 ${clan.fundador ? `Fundador: ${clan.fundadorNombre || clan.fundador}` : 'Clan del sistema'}
│ ⭐ *Nivel:* ${clan.nivel}
│ 👥 *Miembros:* ${clan.miembros.length}
│ 🎯 *Requisito:* ${clan.requisito || 'Ninguno'}
│ 🔒 *Tipo:* ${clan.privado ? 'Privado' : 'Público'}
│ 📅 *Creado:* ${clan.fechaCreacion || 'Sistema'}
│ 
│ 📝 *Descripción:*
│ ${clan.descripcion}
│ 
│ 👥 *Miembros (${Math.min(clan.miembros.length, 10)}/${clan.miembros.length}):*
│ ${nombresMiembros.map((nombre, index) => 
    `${index + 1}. ${nombre} ${clan.miembros[index] === clan.fundador ? '👑' : ''}`
).join('\n│ ')}
╰━━━━━━━━━━━━━━━━━━━━━━⬣`

        return conn.reply(m.chat, info, m, ctxOk)
    }

    // 🛡️ ADMINISTRAR CLAN (funciones básicas)
    async function administrarClan(args) {
        if (!user.clan || user.rangoClan !== 'Líder') {
            return conn.reply(m.chat, '❌ *Solo el líder del clan puede usar este comando*', m, ctxErr)
        }

        const accion = args[0]?.toLowerCase()
        const parametro = args.slice(1).join(' ')

        if (!accion) {
            return conn.reply(m.chat,
`╭━━━〔 🛡️ 𝐀𝐃𝐌𝐈𝐍𝐈𝐒𝐓𝐑𝐀𝐑 𝐂𝐋𝐀𝐍 🛡️ 〕━━━⬣
│ 👑 *Panel de líder:* ${user.clan}
│ 
│ 📝 *Comandos disponibles:*
│ • ${usedPrefix}nkrpg clan admin desc <texto>
│   Cambiar descripción
│ 
│ • ${usedPrefix}nkrpg clan admin req <nivel>
│   Cambiar requisito
│ 
│ • ${usedPrefix}nkrpg clan admin privado
│   Hacer clan privado/público
╰━━━━━━━━━━━━━━━━━━━━━━⬣`,
            m, ctxOk)
        }

        const clan = global.nkRPG.clanes[user.clan]
        if (!clan) {
            return conn.reply(m.chat, '❌ *Clan no encontrado*', m, ctxErr)
        }

        if (accion === 'desc' && parametro) {
            clan.descripcion = parametro
            return conn.reply(m.chat, `✅ *Descripción actualizada:*\n${parametro}`, m, ctxOk)
        }

        if (accion === 'req' && parametro) {
            clan.requisito = `Nivel ${parametro}`
            return conn.reply(m.chat, `✅ *Requisito actualizado:* Nivel ${parametro}`, m, ctxOk)
        }

        if (accion === 'privado') {
            clan.privado = !clan.privado
            return conn.reply(m.chat, `✅ *Clan ahora es:* ${clan.privado ? 'Privado 🔒' : 'Público 🔓'}`, m, ctxOk)
        }

        return conn.reply(m.chat, '❌ *Comando de administración no válido*', m, ctxErr)
    }

    // ... (las otras funciones como mostrarPerfil, iniciarBatalla, etc. se mantienen igual)
    // Solo necesitarías agregar las funciones que faltan como mostrarPerfil, iniciarBatalla, etc.

}

handler.help = ['nkrpg [clan]']
handler.tags = ['rpg']
handler.command = ['rpgclan', 'sistemaclan']
handler.register = true

export default handler