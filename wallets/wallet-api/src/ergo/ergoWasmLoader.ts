export type ErgoWasm = typeof import('ergo-lib-wasm-browser');

/**
 * a class to lazy load and cache encoding and decoding
 * tools for cardano network
 */
class Module {
  _wasm?: ErgoWasm;

  async load(): Promise<ErgoWasm> {
    if (this._wasm === undefined) {
      this._wasm = await import('ergo-lib-wasm-browser');
    }

    return this._wasm!;
  }

  get ErgoWasm(): ErgoWasm {
    return this._wasm!;
  }
}

// need this otherwise Wallet's flow type isn't properly exported
export const RustModule: Module = new Module();
