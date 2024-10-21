const express = require('express');
const app = express();
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const { getRoommate } = require('./utils/getRandomUser');
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static('public'));

//ACA TRAEMOS EL INDEX DESDE LA CARPETA PUBLIC
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/roommate', async (req, res) => {
    try {
        const newRoommate = await getRoommate();
        const roommates = await getRoommatesFromFile();
        newRoommate.id = uuidv4();
        roommates.push(newRoommate);
        await saveRoommatesFile(roommates);
        await recalculateDebts();
        res.status(201).json(newRoommate);
    } catch (error) {
        console.error('Error al crear roommate:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/roommate', async (req, res) => {
    try {
        const roommates = await getRoommatesFromFile();
        res.json(roommates);
    } catch (error) {
        console.error('Error al obtener roommates:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// API Gastos
app.get('/gastos', async (req, res) => {
    try {
        const gastos = await getGastosFromFile();
        res.json(gastos);
    } catch (error) {
        console.error('Error al obtener gastos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/gasto', async (req, res) => {
    try {
        const gasto = req.body;
        gasto.id = uuidv4();
        const gastos = await getGastosFromFile();
        gastos.push(gasto);
        await saveGastosFile(gastos);
        await recalculateDebts();
        res.status(201).json(gasto);
    } catch (error) {
        console.error('Error al crear gasto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.put('/gasto', async (req, res) => {
    try {
        const gastoActualizado = req.body;
        const gastos = await getGastosFromFile();
        const index = gastos.findIndex(g => g.id === gastoActualizado.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Gasto no encontrado' });
        }
        
        gastos[index] = gastoActualizado;
        await saveGastosFile(gastos);
        await recalculateDebts();
        res.json(gastoActualizado);
    } catch (error) {
        console.error('Error al actualizar gasto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.delete('/gasto', async (req, res) => {
    try {
        const { id } = req.query;
        const gastos = await getGastosFromFile();
        const filteredGastos = gastos.filter(g => g.id !== id);
        
        if (filteredGastos.length === gastos.length) {
            return res.status(404).json({ error: 'Gasto no encontrado' });
        }
        
        await saveGastosFile(filteredGastos);
        await recalculateDebts();
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar gasto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Funciones auxiliares
async function getRoommatesFromFile() {
    try {
        const data = await fs.readFile('roommates.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile('roommates.json', '[]');
            return [];
        }
        throw error;
    }
}

async function getGastosFromFile() {
    try {
        const data = await fs.readFile('gastos.json', 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile('gastos.json', '[]');
            return [];
        }
        throw error;
    }
}

async function saveRoommatesFile(roommates) {
    await fs.writeFile('roommates.json', JSON.stringify(roommates, null, 2));
}

async function saveGastosFile(gastos) {
    await fs.writeFile('gastos.json', JSON.stringify(gastos, null, 2));
}

async function recalculateDebts() {
    try {
        const roommates = await getRoommatesFromFile();
        const gastos = await getGastosFromFile();
        
        // Reiniciar deudas
        roommates.forEach(roommate => {
            roommate.debe = 0;
            roommate.recibe = 0;
        });
        
        // Calcular nuevas deudas
        gastos.forEach(gasto => {
            const montoPerCapita = gasto.monto / roommates.length;
            const pagador = roommates.find(r => r.id === gasto.roommate);
            
            if (pagador) {
                pagador.recibe += gasto.monto - montoPerCapita;
                roommates.forEach(roommate => {
                    if (roommate.id !== pagador.id) {
                        roommate.debe += montoPerCapita;
                    }
                });
            }
        });
        
        await saveRoommatesFile(roommates);
    } catch (error) {
        console.error('Error al recalcular deudas:', error);
        throw error;
    }
}



app.listen( PORT, () => {
    console.log(`Servidor buenardo en el puerto ${PORT}`)
})
