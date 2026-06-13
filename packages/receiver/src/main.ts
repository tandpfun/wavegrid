/**
 * Receiver entry point.
 *
 * Demonstrates the adapter pattern — configure input and output
 * adapters via environment variables, then start the receiver.
 */

import { ConsoleOutput, MultiOutput, OutputAdapter, WebSocketInput, WebSocketOutput } from './adapters';
import { Receiver, ShardConfig } from './receiver';

const SIMULATOR_URL = process.env.SIMULATOR_URL || 'ws://localhost:3000';
const ALPHA = parseFloat(process.env.RECEIVER_ALPHA || '0.06');
const FALLBACK_DELAY = parseInt(process.env.FALLBACK_DELAY || '3000', 10);
const WS_OUTPUT_PORT = process.env.WS_OUTPUT_PORT ? parseInt(process.env.WS_OUTPUT_PORT, 10) : undefined;

// Shard config: SHARD_START and SHARD_END define the cannon range this receiver handles.
// When omitted, the receiver outputs all 49 cannons.
let shard: ShardConfig | undefined;
if (process.env.SHARD_START !== undefined && process.env.SHARD_END !== undefined) {
  shard = {
    start: parseInt(process.env.SHARD_START, 10),
    end: parseInt(process.env.SHARD_END, 10)
  };
}

// ─── Input adapter ───
const input = new WebSocketInput({ url: SIMULATOR_URL });

// ─── Output adapter(s) ───
const outputs: OutputAdapter[] = [new ConsoleOutput()];

let wsOutput: WebSocketOutput | null = null;
if (WS_OUTPUT_PORT) {
  wsOutput = new WebSocketOutput({ port: WS_OUTPUT_PORT });
  wsOutput.listen();
  outputs.push(wsOutput);
}

const output = outputs.length === 1 ? outputs[0] : new MultiOutput(outputs);

// ─── Receiver ───
const receiver = new Receiver({
  input,
  output,
  alpha: ALPHA,
  fallbackDelay: FALLBACK_DELAY,
  shard
});

console.log('');
console.log('  \u256D\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256E');
console.log('  \u2502   Illuminate \u00B7 Receiver               \u2502');
console.log('  \u2502   the brain                           \u2502');
console.log('  \u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256F');
console.log('');
console.log(`  \u2192 Input:  WebSocket @ ${SIMULATOR_URL}`);
console.log(`  \u2192 Output: Console${wsOutput ? ` + WebSocket :${WS_OUTPUT_PORT}` : ''}`);
console.log(`  \u2192 Alpha: ${ALPHA}  Fallback delay: ${FALLBACK_DELAY}ms`);
console.log(`  \u2192 Shard: ${shard ? `cannons ${shard.start}\u2013${shard.end} (${shard.end - shard.start + 1} of 49)` : 'all cannons (no shard)'}`);

console.log('');

receiver.start();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n  Shutting down...');
  receiver.stop();
  process.exit(0);
});
process.on('SIGTERM', () => {
  receiver.stop();
  process.exit(0);
});
