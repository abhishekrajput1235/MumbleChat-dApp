import { Client, DecodedMessage } from '@xmtp/xmtp-js';

type OnMessageCallback = (message: DecodedMessage) => void;

export class StreamManager {
  private xmtpClient: Client;
  private onMessage: OnMessageCallback;
  private running: boolean = false;
  private seenMessageIds: Set<string> = new Set();

  constructor(xmtpClient: Client, onMessage: OnMessageCallback) {
    this.xmtpClient = xmtpClient;
    this.onMessage = onMessage;
  }

  async startStream() {
    if (this.running) {
      console.warn('StreamManager: Stream already running');
      return;
    }

    this.running = true;

    try {
      const stream = await this.xmtpClient.conversations.streamAllMessages();

      for await (const message of stream) {
        if (!this.running) break;

        // Deduplication check
        if (!this.seenMessageIds.has(message.id)) {
          this.seenMessageIds.add(message.id);
          this.onMessage(message);
        }
      }
    } catch (err) {
      console.error('StreamManager error:', err);
    }
  }

  stopStream() {
    this.running = false;
  }

  resetDeduplication() {
    this.seenMessageIds.clear();
  }
}
