// socket.js
import { io } from 'socket.io-client';
const URL = 'http://localhost:3001';

export const socket = io(URL, {
  transports: ['websocket'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  query: {
    token: localStorage.getItem('token') || '',
  }
});