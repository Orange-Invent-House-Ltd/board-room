<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	let {
		onclick
	}: {
		onclick: () => void;
	} = $props();
</script>

<h1 class="mb-10 text-2xl font-medium">Uno</h1>
<main class="relative h-screen space-y-6 overflow-auto">
	<div>
		<h2 class=" font-medium capitalize">About Uno</h2>
		<p class="text-xs">
			Uno Online is an exciting puzzle card game. You have to match the cards having the same color
			or number to clear all cards in your hand and block your opponents.
		</p>
	</div>
	<div>
		<h2 class=" font-medium capitalize">Number Cards</h2>
		<p class="text-xs">
			There are a total of 108 cards in this deck. Seventy percent of the deck is made up of number
			cards from 0 to 9, with four colours including blue, green, red, and yellow. Each colour
			features 19 cards with one zero card and two of each other numbers in the deck. Action cards
			and wild cards make up the remaining 30% of the deck.
		</p>
	</div>
	<div>
		<h2 class=" font-medium capitalize">Action cards</h2>
		<div class="text-xs">
			Uno is made more strategic with the addition of action cards. In an Uno deck, there are three
			different sorts of action cards. Each color has two copies of each action card. These are the
			following:
			<div class="pl-5">
				<ul class="list-inside list-disc">
					<li>Skip card - the next player in the sequence misses a turn.</li>
					<li>Reverse - reverses the direction of play.</li>
					<li>Draw two - the next player draws two cards and misses one turn.</li>
				</ul>
			</div>
		</div>
	</div>
	<div>
		<h2 class=" font-medium capitalize">Wild cards</h2>
		<div class="text-xs">
			There are two different sorts of wild cards, each containing four of them. They are as
			follows:

			<div class="pl-5">
				<ul class="list-inside list-disc">
					<li>Wild - lets the player choose what colour to play..</li>
					<li>
						Wild draw 4 - declare the next colour to match, and force the next player to draw four
						cards.
					</li>
					<li>
						Let's play and enjoy tricky Uno matches! Use your own strategies to become the first
						person clearing all cards and win!
					</li>
				</ul>
			</div>
		</div>
	</div>
	<div class="fixed bottom-0 left-0 mt-8 w-full border-t border-gray-700 bg-black px-5 py-5">
		<Button {onclick} class="w-full rounded-full bg-blue-600 py-3 text-white">Send invite</Button>
	</div>
</main>
