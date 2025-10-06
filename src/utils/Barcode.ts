export namespace Barcode {
  export function isSupportedInBrowser() {
    return "BarcodeDetector" in window;
  }

  export function createDetector() {
    if (!isSupportedInBrowser()) return;

    //let detector = new BarcodeDetector({
    //  formats: ['qr_code', 'ean_13', 'code_128', 'aztec', 'data_matrix'],
    //});
    //return detector;
  }
}
