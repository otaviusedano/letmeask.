import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { database } from '../services/firebase'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import { Button } from '../components/Button'

import '../styles/auth.scss'
import { useAuth } from '../hooks/useAuth'
import { Toaster } from 'react-hot-toast'
import { error, errorRoom } from '../components/Notifications'

export function Home() {
  const navigate = useNavigate();
  const { user, signInWithPopup } = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if(!user) {
      await signInWithPopup()
    }

    navigate('rooms/new')
}

  async function handleJoinRoom(e: FormEvent) {
    e.preventDefault();
    
    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get()

    if(!roomRef.exists()){
      error()
      return;
    }

    if (roomRef.val().endedAt) {
      errorRoom()
      return;
    }

    navigate(`Rooms/${roomCode}`)
  }

    return(
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração perguntas e respostas" />  
        <strong>  Toda pergunta tem uma resposta. </strong>
        <p> Tire as dúvidas da sua audiência</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button onClick={handleCreateRoom} className="create-room">
            <img src={googleIconImg} alt="Logo do google" />
            Crie sua sala com o Google
          </button>
          <div className="separator"> ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <Toaster />
            <span></span>
            <input type="text" 
              name="" 
              id="" 
              placeholder="digite o código da sala" 
              onChange={e => setRoomCode(e.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entrar
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}

