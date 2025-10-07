// Comando: ping.js
module.exports = {
    name: 'ping',
    alias: ['p'],
    desc: 'Muestra información completa del bot con reacciones y GIF dinámico',
    category: 'info',
    async exec(m, { conn }) {
        try {
            // Reacción de inicio
            await conn.sendMessage(m.from, { react: { text: '⌛', key: m.key } });

            const start = Date.now();

            // Mensaje temporal para medir latencia
            const temp = await conn.sendMessage(
                m.from,
                { text: '🏓 Calculando ping...' },
                { quoted: m }
            );

            const latency = Date.now() - start; // Latencia del mensaje
            const apiLatency = Math.round(conn.ws?.ping || latency); // Ping de la API

            const fechaHora = new Date().toLocaleString('es-ES', {
                timeZone: 'America/Mexico_City',
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            const servidores = conn.chats ? Object.keys(conn.chats).length : 'N/A';

            // GIF dinámico según la latencia
            let gifURL;
            if (latency < 100) gifURL = 'https://media.giphy.com/media/26tPoyDhjiJ2g7rEs/giphy.gif'; // Verde rápido
            else if (latency < 300) gifURL = 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif'; // Amarillo medio
            else gifURL = 'https://media.giphy.com/media/l0HlOvJ7yaacpuSas/giphy.gif'; // Rojo lento

            // Mensaje final con imagen/GIF
            await conn.sendMessage(
                m.from,
                {
                    image: { url: gifURL }, // Aquí se asegura que la imagen/GIF se muestre
                    caption: `🏓 *Pong!*\n\n*Latencia del mensaje:* ${latency}ms\n*Ping de la API:* ${apiLatency}ms\n*Fecha y hora:* ${fechaHora}\n*Velocidad aproximada:* ${latency}ms\n*Servidores/Chats activos:* ${servidores}`
                },
                { quoted: m }
            );

            // Reacción final
            await conn.sendMessage(m.from, { react: { text: '✅', key: m.key } });

        } catch (error) {
            console.log(error);
            await conn.sendMessage(
                m.from,
                { text: '❌ Ocurrió un error al calcular el ping.' },
                { quoted: m }
            );
        }
    },
};