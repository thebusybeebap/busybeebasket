export function isSupportedInBrowser() {
  return "BarcodeDetector" in window;
}

export function createDetector() {
  if (!isSupportedInBrowser()) return;

  let detector = new BarcodeDetector({
    formats: ["qr_code", "ean_13", "code_128", "upc_a"],
  });
  return detector;
}

export async function hasCameraAccess() {
  let cameraAccess = await navigator.permissions.query({ name: "camera" });
  if (cameraAccess.state === "granted" || cameraAccess.state === "prompt") {
    return true;
  }
  return false;
}

/*

import React, { useState, useRef, useEffect } from 'react';

// A simple CSS for styling the component
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    maxWidth: '500px',
    margin: '2rem auto',
    fontFamily: 'sans-serif',
  },
  video: {
    width: '100%',
    maxWidth: '480px',
    border: '1px solid #ddd',
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
  result: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#333',
  }
};

const BarcodeScanner = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedBarcode, setDetectedBarcode] = useState('');
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // 1. Check for BarcodeDetector API support on component mount
  useEffect(() => {
    if ('BarcodeDetector' in window) {
      setIsSupported(true);
    } else {
      setError('BarcodeDetector API is not supported in this browser. 😢');
    }
  }, []);

  // Function to start the camera and scanning process
  const startScan = async () => {
    setError('');
    setDetectedBarcode('');
    setIsScanning(true);

    try {
      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Prefer the rear camera
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        // Start detecting barcodes
        requestAnimationFrame(detectBarcode);
      }
    } catch (err) {
      setError(`Error accessing camera: ${err.message}`);
      setIsScanning(false);
    }
  };

  // Function to stop the camera
  const stopScan = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  // The main detection loop
  const detectBarcode = async () => {
    if (!isScanning || !videoRef.current || videoRef.current.readyState < 2) {
      return;
    }

    try {
      // Initialize the BarcodeDetector
      const barcodeDetector = new window.BarcodeDetector({
        formats: ['qr_code', 'ean_13', 'code_128', 'upc_a'], // Specify formats
      });

      const barcodes = await barcodeDetector.detect(videoRef.current);
      
      if (barcodes.length > 0) {
        setDetectedBarcode(barcodes[0].rawValue);
        console.log('Barcode detected:', barcodes[0]);
        stopScan(); // Stop scanning once a barcode is found
      } else {
        // Continue scanning if no barcode is found
        requestAnimationFrame(detectBarcode);
      }
    } catch (err) {
      setError(`Error detecting barcode: ${err.message}`);
    }
  };
  
  const handleToggleScan = () => {
    if (isScanning) {
      stopScan();
    } else {
      startScan();
    }
  };

  return (
    <div style={styles.container}>
      <h3>PWA Barcode Scanner</h3>
      {!isSupported ? (
        <p style={styles.error}>
          Your browser does not support the Barcode Detection API. 
          Please try on Chrome for Android or a modern desktop browser.
        </p>
      ) : (
        <>
          <video 
            ref={videoRef} 
            style={{ ...styles.video, display: isScanning ? 'block' : 'none' }} 
            muted
          />
          <button onClick={handleToggleScan} style={styles.button}>
            {isScanning ? 'Stop Scanning' : 'Start Camera'}
          </button>
          {error && <p style={styles.error}>{error}</p>}
          {detectedBarcode && (
            <p style={styles.result}>
              ✅ Detected Barcode: {detectedBarcode}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default BarcodeScanner;

*/

/*
import React, { useState, useRef, useEffect, CSSProperties } from 'react';

// --- Type Declarations for BarcodeDetector API ---
// This API is not yet in standard TypeScript DOM libraries.
// We declare the necessary interfaces to make TypeScript happy.

interface DetectedBarcode {
  rawValue: string;
  boundingBox?: DOMRectReadOnly;
  format?: string;
  cornerPoints?: { x: number, y: number }[];
}

interface BarcodeDetectorOptions {
  formats: string[];
}

interface BarcodeDetectorConstructor {
  new(options?: BarcodeDetectorOptions): BarcodeDetector;
}

interface BarcodeDetector {
  detect(image: ImageBitmapSource): Promise<DetectedBarcode[]>;
}

// Augment the global Window interface to include BarcodeDetector
declare global {
  interface Window {
    BarcodeDetector: BarcodeDetectorConstructor;
  }
}
// --- End of Type Declarations ---


// A simple CSS for styling the component
// We type the styles object using an index signature and React's CSSProperties
const styles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    maxWidth: '500px',
    margin: '2rem auto',
    fontFamily: 'sans-serif',
  },
  video: {
    width: '100%',
    maxWidth: '480px',
    border: '1px solid #ddd',
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
  },
  result: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#333',
  }
};

// Type the component as a React Functional Component
const BarcodeScanner: React.FC = () => {
  // Add explicit types to useState hooks
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [detectedBarcode, setDetectedBarcode] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Add explicit types to useRef hooks
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 1. Check for BarcodeDetector API support on component mount
  useEffect(() => {
    // Check if the browser supports the BarcodeDetector API
    if ('BarcodeDetector' in window) {
      setIsSupported(true);
    } else {
      setError('BarcodeDetector API is not supported in this browser. 😢');
    }
  }, []);

  // Function to start the camera and scanning process
  const startScan = async (): Promise<void> => {
    setError('');
    setDetectedBarcode('');
    setIsScanning(true);

    try {
      // Get camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Prefer the rear camera
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        // Start detecting barcodes in a loop
        requestAnimationFrame(detectBarcode);
      }
    } catch (err) {
      // Type-safe error handling
      let message = 'Unknown error';
      if (err instanceof Error) {
        message = err.message;
      }
      setError(`Error accessing camera: ${message}`);
      setIsScanning(false);
    }
  };

  // Function to stop the camera
  const stopScan = (): void => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  // The main detection loop
  const detectBarcode = async (): Promise<void> => {
    // Guard against null ref or video not being ready
    if (!isScanning || !videoRef.current || videoRef.current.readyState < 2) {
      return;
    }

    try {
      // Initialize the BarcodeDetector
      // This now type-checks thanks to our global declarations
      const barcodeDetector = new window.BarcodeDetector({
        formats: ['qr_code', 'ean_13', 'code_128', 'upc_a'], // Specify formats
      });

      // 'barcodes' is automatically typed as 'DetectedBarcode[]'
      const barcodes = await barcodeDetector.detect(videoRef.current);
      
      if (barcodes.length > 0) {
        setDetectedBarcode(barcodes[0].rawValue);
        console.log('Barcode detected:', barcodes[0]);
        stopScan(); // Stop scanning once a barcode is found
      } else {
        // Continue scanning if no barcode is found
        requestAnimationFrame(detectBarcode);
      }
    } catch (err) {
      // Type-safe error handling
      let message = 'Unknown error';
      if (err instanceof Error) {
        message = err.message;
      }
      // Don't flood with errors, but maybe log them
      console.error(`Error detecting barcode: ${message}`);
      // Continue scanning
      if (isScanning) {
        requestAnimationFrame(detectBarcode);
      }
    }
  };
  
  const handleToggleScan = (): void => {
    if (isScanning) {
      stopScan();
    } else {
      startScan();
    }
  };

  return (
    <div style={styles.container}>
      <h3>PWA Barcode Scanner</h3>
      {!isSupported ? (
        <p style={styles.error}>
          Your browser does not support the Barcode Detection API. 
          Please try on Chrome for Android or a modern desktop browser.
        </p>
      ) : (
        <>
          <video 
            ref={videoRef} 
            style={{ ...styles.video, display: isScanning ? 'block' : 'none' }} 
            muted
            playsInline // Important for mobile browsers
          />
          <button onClick={handleToggleScan} style={styles.button}>
            {isScanning ? 'Stop Scanning' : 'Start Camera'}
          </button>
          {error && <p style={styles.error}>{error}</p>}
          {detectedBarcode && (
            <p style={styles.result}>
              ✅ Detected Barcode: {detectedBarcode}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default BarcodeScanner;
*/
