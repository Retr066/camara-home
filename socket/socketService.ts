import io from 'socket.io-client';

const socket = io('http://localhost:8000/'); // Reemplaza con la IP y puerto de tu servidor

export default socket;
