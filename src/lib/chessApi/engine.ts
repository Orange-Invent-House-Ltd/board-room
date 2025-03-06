import type { Chess } from 'chess.js';
import type { Color } from './api';

export class Engine {
	color: Color;
	depth: number;
	moveTime: number;
	onMove?: (move: { from: string; to: string; promotion?: string }) => void;
	private worker: Worker;

	constructor({ color, depth, moveTime }: { color: Color; depth: number; moveTime: number }) {
		this.color = color;
		this.depth = depth;
		this.moveTime = moveTime;

		if (typeof window !== 'undefined') {
			this.worker = new Worker('/stockfish.js');
			this.worker.onmessage = (e) => this.handleMessage(e);
			this.init();
		}
	}

	private init() {
		this.worker.postMessage('uci');
		this.worker.postMessage('isready');
	}

	analyze(fen: string) {
		if (!this.worker) return;

		// Clear any previous analysis
		this.worker.postMessage('stop');
		this.worker.postMessage('position fen ' + fen);
		this.worker.postMessage(`go depth ${this.depth} movetime ${this.moveTime}`);
	}

	private handleMessage(e: MessageEvent) {
		const message = e.data as string;
		if (message.startsWith('bestmove')) {
			const [, moveStr] = message.split(' ');
			if (moveStr && moveStr !== '(none)' && this.onMove) {
				try {
					// Convert UCI move format (e.g. "e2e4") to move object
					const from = moveStr.slice(0, 2);
					const to = moveStr.slice(2, 4);
					const promotion = moveStr.length > 4 ? moveStr[4] : undefined;

					// Only send valid moves
					this.onMove({ from, to, promotion });
				} catch (err) {
					console.error('Engine move error:', err);
				}
			}
		}
	}

	setUciCallback(callback: (message: string) => void) {
		const originalOnMessage = this.worker.onmessage;
		this.worker.onmessage = (e) => {
			callback(e.data);
			if (originalOnMessage) {
				originalOnMessage.call(this.worker, e);
			}
		};
	}

	stopSearch() {
		this.worker.postMessage('stop');
	}

	destroy() {
		this.worker?.terminate();
	}
}
