// src/xmtp/codecs/ReadReceiptCodec.ts

import {
  ContentTypeId,
  Codec,
  EncodedContent,
} from '@xmtp/xmtp-js';

export const ContentTypeReadReceipt = new ContentTypeId({
  authorityId: 'mumble.chat',
  typeId: 'read',
  versionMajor: 1,
  versionMinor: 0,
});

export interface ReadReceipt {
  messageId: string;
}

export class ReadReceiptCodec implements Codec<ReadReceipt> {
  contentType = ContentTypeReadReceipt;

  encode(content: ReadReceipt): EncodedContent {
    return {
      type: this.contentType,
      parameters: {},
      content: new TextEncoder().encode(JSON.stringify(content)),
    };
  }

  decode(encoded: EncodedContent): ReadReceipt {
    return JSON.parse(new TextDecoder().decode(encoded.content));
  }
}
