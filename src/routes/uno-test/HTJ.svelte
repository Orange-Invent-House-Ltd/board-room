<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>UNO Game with Computer Opponent</title>
		<style>
			body {
				font-family: Arial, sans-serif;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100vh;
				margin: 0;
				background-color: #f0f0f0;
			}
			#game {
				text-align: center;
			}
			#current-card {
				font-size: 24px;
				margin-bottom: 20px;
			}
			#player-hand,
			#computer-hand {
				display: flex;
				justify-content: center;
				flex-wrap: wrap;
				gap: 10px;
				margin-bottom: 20px;
			}
			.card {
				width: 80px;
				height: 120px;
				border: 1px solid #000;
				border-radius: 10px;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 18px;
				cursor: pointer;
			}
			.red {
				background-color: #ffcccb;
			}
			.blue {
				background-color: #add8e6;
			}
			.green {
				background-color: #90ee90;
			}
			.yellow {
				background-color: #ffffe0;
			}
			.wild {
				background: linear-gradient(45deg, #ffcccb, #add8e6, #90ee90, #ffffe0);
			}
			.computer-card {
				background-color: #808080;
				color: white;
			}
			#color-chooser {
				display: none;
				margin-top: 10px;
			}
			#color-chooser button {
				margin: 0 5px;
				padding: 5px 10px;
			}
			#message {
				margin-top: 10px;
				font-weight: bold;
			}
		</style>
	</head>
	<body>
		<div id="game">
			<h1>UNO Game with Computer Opponent</h1>
			<div id="computer-hand"></div>
			<div id="current-card"></div>
			<div id="player-hand"></div>
			<button id="draw-card">Draw Card</button>
			<div id="color-chooser">
				<button class="red">Red</button>
				<button class="blue">Blue</button>
				<button class="green">Green</button>
				<button class="yellow">Yellow</button>
			</div>
			<p id="message"></p>
		</div>

		<script>
			const colors = ['red', 'blue', 'green', 'yellow'];
			const values = [
				'0',
				'1',
				'2',
				'3',
				'4',
				'5',
				'6',
				'7',
				'8',
				'9',
				'Skip',
				'Reverse',
				'Draw Two',
				'Wild',
				'Wild Draw Four'
			];
			let deck = [];
			let playerHand = [];
			let computerHand = [];
			let currentCard;
			let currentPlayer = 'player';
			let currentColor;

			function createDeck() {
				deck = [];
				for (let color of colors) {
					for (let value of values) {
						if (value === 'Wild' || value === 'Wild Draw Four') {
							deck.push({ color: 'wild', value });
						} else {
							deck.push({ color, value });
						}
					}
				}
			}

			function shuffleDeck() {
				for (let i = deck.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[deck[i], deck[j]] = [deck[j], deck[i]];
				}
			}

			function dealInitialHands() {
				playerHand = [];
				computerHand = [];
				for (let i = 0; i < 7; i++) {
					playerHand.push(deck.pop());
					computerHand.push(deck.pop());
				}
			}

			function updateCurrentCard() {
				document.getElementById('current-card').innerHTML = `
                <div class="card ${currentCard.color}">
                    ${currentCard.value}
                </div>
            `;
			}

			function updatePlayerHand() {
				const playerHandElement = document.getElementById('player-hand');
				playerHandElement.innerHTML = '';
				for (let card of playerHand) {
					const cardElement = document.createElement('div');
					cardElement.className = `card ${card.color}`;
					cardElement.textContent = card.value;
					cardElement.onclick = () => playCard(card);
					playerHandElement.appendChild(cardElement);
				}
			}

			function updateComputerHand() {
				const computerHandElement = document.getElementById('computer-hand');
				computerHandElement.innerHTML = '';
				for (let i = 0; i < computerHand.length; i++) {
					const cardElement = document.createElement('div');
					cardElement.className = 'card computer-card';
					cardElement.textContent = 'UNO';
					computerHandElement.appendChild(cardElement);
				}
			}

			function playCard(card) {
				if (currentPlayer !== 'player') return;
				if (
					card.color === 'wild' ||
					card.color === currentColor ||
					card.value === currentCard.value
				) {
					currentCard = card;
					currentColor = card.color === 'wild' ? currentColor : card.color;
					playerHand = playerHand.filter((c) => c !== card);
					updateCurrentCard();
					updatePlayerHand();

					if (card.color === 'wild') {
						showColorChooser(card);
					} else {
						applyCardEffect(card);
						checkWinCondition('player');
						if (playerHand.length > 0 && currentPlayer === 'computer') {
							setTimeout(computerTurn, 1000);
						}
					}
				} else {
					alert('Invalid move!');
				}
			}

			function showColorChooser(card) {
				const colorChooser = document.getElementById('color-chooser');
				colorChooser.style.display = 'block';
				colorChooser.onclick = (event) => {
					if (event.target.tagName === 'BUTTON') {
						currentColor = event.target.className;
						colorChooser.style.display = 'none';
						currentCard.color = currentColor;
						updateCurrentCard();
						applyCardEffect(card);
						checkWinCondition('player');
						if (playerHand.length > 0 && currentPlayer === 'computer') {
							setTimeout(computerTurn, 1000);
						}
					}
				};
			}

			function applyCardEffect(card) {
				switch (card.value) {
					case 'Skip':
					case 'Reverse':
						// In a two-player game, both Skip and Reverse allow the current player to go again
						break;
					case 'Draw Two':
						if (currentPlayer === 'player') {
							drawCards(computerHand, 2);
							updateComputerHand();
						} else {
							drawCards(playerHand, 2);
							updatePlayerHand();
						}
						break;
					case 'Wild Draw Four':
						if (currentPlayer === 'player') {
							drawCards(computerHand, 4);
							updateComputerHand();
						} else {
							drawCards(playerHand, 4);
							updatePlayerHand();
						}
						break;
					default:
						currentPlayer = currentPlayer === 'player' ? 'computer' : 'player';
				}
			}

			function drawCards(hand, count) {
				for (let i = 0; i < count; i++) {
					if (deck.length > 0) {
						hand.push(deck.pop());
					} else {
						reshuffleDeck();
						if (deck.length > 0) {
							hand.push(deck.pop());
						} else {
							alert('No more cards in the deck!');
							break;
						}
					}
				}
			}

			function reshuffleDeck() {
				let discardPile = deck.splice(0, deck.length);
				deck = discardPile.concat(deck);
				shuffleDeck();
			}

			function drawCard() {
				if (currentPlayer !== 'player') return;
				if (deck.length > 0) {
					const drawnCard = deck.pop();
					playerHand.push(drawnCard);
					updatePlayerHand();
					if (
						drawnCard.color === currentColor ||
						drawnCard.value === currentCard.value ||
						drawnCard.color === 'wild'
					) {
						playCard(drawnCard);
					} else {
						currentPlayer = 'computer';
						setTimeout(computerTurn, 1000);
					}
				} else {
					reshuffleDeck();
					if (deck.length > 0) {
						drawCard();
					} else {
						alert('No more cards in the deck!');
					}
				}
			}

			function computerTurn() {
				let playableCards = computerHand.filter(
					(card) =>
						card.color === 'wild' || card.color === currentColor || card.value === currentCard.value
				);

				if (playableCards.length > 0) {
					let selectedCard = playableCards[Math.floor(Math.random() * playableCards.length)];
					currentCard = selectedCard;
					currentColor =
						selectedCard.color === 'wild'
							? colors[Math.floor(Math.random() * colors.length)]
							: selectedCard.color;
					computerHand = computerHand.filter((c) => c !== selectedCard);
					updateCurrentCard();
					updateComputerHand();

					applyCardEffect(selectedCard);
					checkWinCondition('computer');
					if (currentPlayer === 'computer') {
						setTimeout(computerTurn, 1000);
					}
				} else {
					drawCards(computerHand, 1);
					updateComputerHand();
					currentPlayer = 'player';
				}
			}

			function checkWinCondition(player) {
				if (player === 'player' && playerHand.length === 0) {
					alert('Congratulations! You win!');
					initializeGame();
				} else if (player === 'computer' && computerHand.length === 0) {
					alert('Computer wins! Better luck next time.');
					initializeGame();
				}
			}

			function initializeGame() {
				createDeck();
				shuffleDeck();
				dealInitialHands();
				currentCard = deck.pop();
				while (currentCard.color === 'wild') {
					deck.push(currentCard);
					shuffleDeck();
					currentCard = deck.pop();
				}
				currentColor = currentCard.color;
				currentPlayer = 'player';
				updateCurrentCard();
				updatePlayerHand();
				updateComputerHand();
			}

			document.getElementById('draw-card').onclick = drawCard;
			initializeGame();
		</script>
	</body>
</html>
