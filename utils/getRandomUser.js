const axios = require('axios');

async function getRoommate() {
    try {
        const response = await axios.get('https://randomuser.me/api/');
        const user = response.data.results[0];
        
        return {
            nombre: `${user.name.first} ${user.name.last}`,
            debe: 0,
            recibe: 0
        };
    } catch (error) {
        console.error('Error al obtener random user:', error);
        throw new Error('Error al obtener usuario aleatorio');
    }
}

module.exports = {
    getRoommate
};