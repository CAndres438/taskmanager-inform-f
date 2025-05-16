import { useState } from 'react'
import taskLogo from '/taskinform.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={taskLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Task Inform</h1>
    
    </>
  )
}

export default App
