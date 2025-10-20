import { Ban, CameraOff, Scan, ScanBarcode } from "lucide-react";
import {
  createDetector,
  isSupportedInBrowser,
  hasCameraAccess,
} from "../utils/Barcode";
import { ReactNode, useRef, useState } from "react";

function BarcodeScanner({
  callAfterScan,
  buttonIcon,
}: {
  callAfterScan: (scannedBarcode: string) => void;
  buttonIcon?: ReactNode;
}) {
  let videoRef = useRef<HTMLVideoElement>(null);
  let streamRef = useRef<MediaStream>(null);
  let dialogRef = useRef<HTMLDialogElement>(null);
  let [hasCamAccess, setHasCamAccess] = useState(false);

  function stopScan(barcodeValue?: string) {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (dialogRef.current) {
      dialogRef.current.close();
    }

    if (barcodeValue) {
      callAfterScan(barcodeValue);
    }
  }

  async function detectBarcode() {
    if (!videoRef.current || videoRef.current.readyState < 2) {
      return;
    }

    let barcodeDetector = createDetector();
    const barcodes = await barcodeDetector.detect(videoRef.current);

    if (barcodes.length > 0) {
      stopScan(barcodes[0].rawValue);
    } else {
      requestAnimationFrame(detectBarcode);
    }
  }

  async function startScan() {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
    let stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    streamRef.current = stream;

    let cameraAccess = await hasCameraAccess();
    setHasCamAccess(cameraAccess);

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      requestAnimationFrame(detectBarcode);
    }
  }

  function handleScanClick() {
    startScan();
  }

  if (!isSupportedInBrowser()) return null;
  return (
    <>
      <button
        onClick={handleScanClick}
        className="cursor-pointer rounded-lg text-gray-700 transition-all hover:bg-gray-200 active:scale-90 active:opacity-50"
      >
        {buttonIcon ? buttonIcon : <ScanBarcode size={40} strokeWidth={1.5} />}
      </button>

      <dialog
        ref={dialogRef}
        className="absolute top-0 right-0 bottom-0 left-0 m-auto h-fit w-full rounded-2xl shadow-lg backdrop:bg-neutral-700/50 backdrop:backdrop-blur-sm"
        data-modal
        open={false}
      >
        <div className="absolute z-10 flex h-full w-full items-center justify-center rounded-t-2xl">
          <div className="absolute flex h-full items-center justify-center opacity-20">
            {hasCamAccess ? (
              <Scan size={300} strokeWidth={1} />
            ) : (
              <CameraOff className="pt-8 pb-16" size={200} strokeWidth={1} />
            )}
          </div>
          {hasCamAccess ? (
            <div className="absolute flex h-full items-center justify-center opacity-20">
              <span className="text-4xl">SCAN BARCODE</span>
            </div>
          ) : null}
          <button
            onClick={() => stopScan()}
            className="z-20 w-full grow-0 cursor-pointer self-end rounded-b-2xl border-4 border-dashed border-red-700/50 bg-neutral-200 text-red-700/50 opacity-100 transition-all hover:text-red-700 active:scale-90 active:text-red-700"
          >
            <span className="p-y-2 flex items-center justify-center gap-1 text-2xl">
              <Ban />
              Cancel Scan
            </span>
          </button>
        </div>
        <video
          className="block h-full w-full flex-1 rounded-2xl border-4 border-neutral-700/20"
          ref={videoRef}
          muted
        ></video>
      </dialog>
    </>
  );
}

export default BarcodeScanner;
