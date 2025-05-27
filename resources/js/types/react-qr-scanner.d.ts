declare module 'react-qr-scanner' {
  import { Component } from 'react';

  interface QrScannerProps {
    delay?: number;
    style?: object;
    className?: string;
    onError?: (error: any) => void;
    onScan?: (data: { text: string } | null) => void;
    legacyMode?: boolean;
    facingMode?: string;
    constraints?: MediaTrackConstraints;
  }

  export default class QrScanner extends Component<QrScannerProps> {}
}
