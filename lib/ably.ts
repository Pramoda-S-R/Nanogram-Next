import { Realtime } from 'ably';

export const ably = new Realtime(process.env.ABLY_API_KEY!);