const Transform = require("stream").Transform;

const SYNC_BYTES = Object.freeze([0xce, 0xfa]);
const DATA_BYTE_LENGTH = 6;

class ProtocolParser extends Transform {
  constructor() {
    super({ readableObjectMode: true });

    this.buffer = new Uint8Array(new ArrayBuffer(DATA_BYTE_LENGTH));
    this.position = 0;
    this.fsmState = "SYNC";
  }

  convertBinToObject() {
    const [heading, windDirection, tilt] = new Uint16Array(this.buffer.buffer);
    return { heading, windDirection, tilt };
  }

  _transform(chunk, encoding, callback) {
    let cursor = 0;
    while (cursor < chunk.length) {
      switch (this.fsmState) {
        case "SYNC":
          if (chunk[cursor] === SYNC_BYTES[this.position]) {
            this.position++;
            if(this.position === SYNC_BYTES.length) {
                this.position = 0;
                this.fsmState = "DATA";
            }
          } else {
            this.position = 0;
            this.fsmState = "SYNC";
          }
          break;
        case "DATA":
          this.buffer[this.position] = chunk[cursor];
          this.position++;
          if (this.position === this.buffer.byteLength) {
            this.push(this.convertBinToObject());
            this.position = 0;
            this.fsmState = "SYNC";
          }
          break;
      }
      cursor++;
    }
    callback();
  }
}

module.exports = ProtocolParser;
