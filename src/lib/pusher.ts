// import { APP_ID, KEY, SECRET } from '$env/static/private';
import PusherServer from 'pusher';
import Pusher from 'pusher-js';

export const pusherServer = new PusherServer({
	appId: '1846547',
	key: '056f790af8d3aaa84833',
	secret: '5319c7752835c0cdcc74',
	cluster: 'mt1'
});

export const pusherClient = new Pusher('056f790af8d3aaa84833', {
	cluster: 'mt1'
});
