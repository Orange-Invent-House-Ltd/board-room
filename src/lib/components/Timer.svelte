<script lang="ts">
	interface Props {
		seconds?: number;
		classes?: string;
		paused?: boolean;
		onExpired: () => void;
	}

	let {
		seconds = $bindable(0),
		classes = '',
		paused = $bindable(false),
		onExpired
	}: Props = $props();

	let hasExpired = $state(false);
	let active = $state(false);
	let interval = $state<number | null>(null);

	function formatTime(totalSeconds: number): string {
		const minutes = Math.floor(totalSeconds / 60);
		const remainingSeconds = totalSeconds % 60;
		return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	function start() {
		if (!active && !paused) {
			active = true;
			interval = setInterval(() => {
				if (seconds > 0) {
					seconds--;
				} else {
					stop();
					onExpired();
				}
			}, 1000);
		}
	}

	function stop() {
		if (interval !== null) {
			clearInterval(interval);
			interval = null;
		}
		active = false;
	}

	$effect(() => {
		if (paused) {
			stop();
		} else {
			start();
		}
	});

	$effect(() => {
		if (seconds <= 0 && !hasExpired) {
			stop();
			hasExpired = true;
			onExpired();
		}
	});

	// Clean up the interval when the component is destroyed
	$effect.root(() => {
		return () => {
			if (interval !== null) {
				clearInterval(interval);
			}
		};
	});
</script>

<div class={classes}>{formatTime(seconds)}</div>
