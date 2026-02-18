import { useState } from 'react'
import { SetupScreen } from './screens/SetupScreen'
import { CallScreen }  from './screens/CallScreen'

export default function App() {
  const [screen, setScreen] = useState('setup')        // setup | call
  const [stakeholder, setStakeholder] = useState('worker')

  const handleStart = () => setScreen('call')
  const handleExit  = () => setScreen('setup')

  if (screen === 'call') {
    return <CallScreen stakeholder={stakeholder} onExit={handleExit} />
  }

  return (
    <SetupScreen
      stakeholder={stakeholder}
      setStakeholder={setStakeholder}
      onStart={handleStart}
    />
  )
}
