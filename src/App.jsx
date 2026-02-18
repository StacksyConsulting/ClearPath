import { useState } from 'react'
import { SetupScreen } from './screens/SetupScreen'
import { CallScreen }  from './screens/CallScreen'

export default function App() {
  const [screen, setScreen]         = useState('setup')   // setup | call
  const [stakeholder, setStakeholder] = useState('worker')
  const [callMode, setCallMode]     = useState('demo')    // demo | live

  const handleStart = (mode) => {
    setCallMode(mode)
    setScreen('call')
  }

  const handleExit = () => setScreen('setup')

  if (screen === 'call') {
    return (
      <CallScreen
        stakeholder={stakeholder}
        callMode={callMode}
        onExit={handleExit}
      />
    )
  }

  return (
    <SetupScreen
      stakeholder={stakeholder}
      setStakeholder={setStakeholder}
      onStart={handleStart}
    />
  )
}
