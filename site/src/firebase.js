import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAqe-vixCcenxgSmXcGrszkeooWFxc6XDs',
  authDomain: 'wordle-bot-4b4e3.firebaseapp.com',
  databaseURL: 'https://wordle-bot-4b4e3-default-rtdb.firebaseio.com',
  projectId: 'wordle-bot-4b4e3',
  storageBucket: 'wordle-bot-4b4e3.appspot.com',
  messagingSenderId: '197146352982',
  appId: '1:197146352982:web:cd4eab3da3f1d88a510af7',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
