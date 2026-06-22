import * as React from 'react'
import { Hero, type Phase } from '@/components/Hero'
import { GlassFilters } from '@/components/glass/liquid-glass'
import type { Scene } from '@/lib/utils'

// Delay between joining the waitlist and the scene breaking into daylight.
const SUCCESS_TO_DAY_MS = 1800
// Copy swaps partway into the daybreak so the side text changes as light grows.
const COPY_LAG_MS = 2400

export default function App() {
	const [scene, setScene] = React.useState<Scene>('night')
	const [copyScene, setCopyScene] = React.useState<Scene>('night')
	const [phase, setPhase] = React.useState<Phase>('idle')
	const [replayKey, setReplayKey] = React.useState(0)
	const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])

	const clearTimers = () => {
		timers.current.forEach(clearTimeout)
		timers.current = []
	}

	const handleSubmit = React.useCallback(() => {
		setPhase('success')
		clearTimers()
		timers.current.push(setTimeout(() => setScene('day'), SUCCESS_TO_DAY_MS))
		timers.current.push(
			setTimeout(() => setCopyScene('day'), SUCCESS_TO_DAY_MS + COPY_LAG_MS),
		)
	}, [])

	React.useEffect(() => () => clearTimers(), [])

	const reset = () => {
		clearTimers()
		setPhase('idle')
		setScene('night')
		setCopyScene('night')
		setReplayKey((k) => k + 1)
	}

	// Dev: jump scenes with the same lagged-copy behaviour as the real flow.
	const toggleScene = () => {
		clearTimers()
		const next: Scene = scene === 'night' ? 'day' : 'night'
		setScene(next)
		timers.current.push(setTimeout(() => setCopyScene(next), COPY_LAG_MS))
	}

	return (
		<>
			<GlassFilters />
			<Hero key={replayKey} scene={scene} copyScene={copyScene} phase={phase} onSubmit={handleSubmit} />
			{import.meta.env.DEV && (
				<div className="fixed bottom-3 right-3 z-50 flex gap-1.5 rounded-full bg-black/60 p-1.5 text-xs text-white backdrop-blur-md">
					<button className="rounded-full px-3 py-1 hover:bg-white/15" onClick={reset}>
						Replay
					</button>
					<button className="rounded-full px-3 py-1 hover:bg-white/15" onClick={toggleScene}>
						{scene === 'night' ? 'Day' : 'Night'}
					</button>
					<button
						className="rounded-full px-3 py-1 hover:bg-white/15"
						onClick={handleSubmit}
					>
						Submit
					</button>
				</div>
			)}
		</>
	)
}
