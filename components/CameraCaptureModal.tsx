"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Camera,
  X,
  RefreshCw,
  SwitchCamera,
  Check,
  AlertCircle,
  Sparkles,
  Smartphone,
  Upload,
} from "lucide-react";

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
  onSwitchToUpload?: () => void;
}

export default function CameraCaptureModal({
  isOpen,
  onClose,
  onCapture,
  onSwitchToUpload,
}: CameraCaptureModalProps) {
  const [mounted, setMounted] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [capturedBlob, setCapturedBlob] = useState<{ url: string; file: File } | null>(null);
  const [cameraError, setCameraError] = useState<string>("");
  const [isCapturing, setIsCapturing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Stop current active media stream
  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Start camera stream
  const startCamera = useCallback(async (facing: "environment" | "user" = facingMode) => {
    setCameraError("");
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser tidak mendukung akses kamera langsung. Gunakan opsi 'Kamera Bawaan HP'.");
      }

      // Check available video devices
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        setHasMultipleCameras(videoDevices.length > 1);
      } catch (devErr) {
        // ignore
      }

      // Stop previous stream if any
      if (videoRef.current && videoRef.current.srcObject) {
        const oldStream = videoRef.current.srcObject as MediaStream;
        oldStream.getTracks().forEach((t) => t.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn("Camera start failed:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Izin kamera ditolak. Berikan izin kamera di pengaturan browser Anda.");
      } else {
        setCameraError(err.message || "Gagal menyalakan kamera langsung.");
      }
    }
  }, [facingMode]);

  // Handle open/close
  useEffect(() => {
    if (isOpen) {
      setCapturedBlob(null);
      setCameraError("");
      startCamera("environment");
    } else {
      stopStream();
    }
    return () => {
      stopStream();
    };
  }, [isOpen]);

  // Flip between rear & front camera
  const handleToggleFacingMode = () => {
    const nextFacing = facingMode === "environment" ? "user" : "environment";
    setFacingMode(nextFacing);
    stopStream();
    startCamera(nextFacing);
  };

  // Shutter click: capture frame to canvas
  const handleSnap = () => {
    if (!videoRef.current) return;
    setIsCapturing(true);

    try {
      const video = videoRef.current;
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Gagal menginisialisasi canvas");

      ctx.drawImage(video, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setCameraError("Gagal mengambil gambar dari kamera");
            setIsCapturing(false);
            return;
          }

          const file = new File(
            [blob],
            `struk-camera-${Date.now()}.jpg`,
            { type: "image/jpeg" }
          );
          const previewUrl = URL.createObjectURL(blob);

          // Freeze stream & show preview
          stopStream();
          setCapturedBlob({ url: previewUrl, file });
          setIsCapturing(false);
        },
        "image/jpeg",
        0.92
      );
    } catch (e: any) {
      setCameraError(e.message || "Gagal memotret");
      setIsCapturing(false);
    }
  };

  // Handle retake
  const handleRetake = () => {
    setCapturedBlob(null);
    startCamera(facingMode);
  };

  // Handle confirm
  const handleConfirm = () => {
    if (!capturedBlob) return;
    onCapture(capturedBlob.file);
    onClose();
  };

  // Native phone camera fallback
  const handleNativeCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCapture(file);
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          stopStream();
          onClose();
        }
      }}
    >
      {/* Hidden Native Camera Input with capture="environment" for 100% direct native phone camera */}
      <input
        type="file"
        ref={nativeCameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleNativeCameraChange}
        className="hidden"
      />

      <div className="bg-[#111111] text-white rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-white/10 shrink-0 bg-[#161616]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Scan Kamera Struk
              </h3>
              <p className="text-[11px] text-white/50">
                Posisikan struk belanja di dalam kotak panduan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              stopStream();
              onClose();
            }}
            className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Preview Body */}
        <div className="relative flex-1 min-h-[320px] sm:min-h-[380px] bg-black flex items-center justify-center overflow-hidden">
          {capturedBlob ? (
            /* Snapshot Preview */
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
              <img
                src={capturedBlob.url}
                alt="Captured receipt"
                className="max-h-[340px] sm:max-h-[400px] w-auto rounded-2xl object-contain shadow-2xl border border-white/20"
              />
              <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                <Check className="w-3.5 h-3.5" />
                <span>Foto Berhasil Diambil</span>
              </div>
            </div>
          ) : cameraError ? (
            /* Error / Permission screen */
            <div className="p-6 text-center space-y-4 max-w-sm mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Tidak Dapat Mengakses Kamera</h4>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  {cameraError}
                </p>
              </div>

              {/* Alternative button: Native phone camera shutter */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => nativeCameraInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Buka Kamera Bawaan HP</span>
                </button>

                {onSwitchToUpload && (
                  <button
                    type="button"
                    onClick={() => {
                      stopStream();
                      onClose();
                      onSwitchToUpload();
                    }}
                    className="w-full py-2 px-4 rounded-full bg-white/10 hover:bg-white/15 text-white/80 text-xs font-medium flex items-center justify-center gap-2 transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih dari Galeri / Berkas</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Live Camera Video Feed with Viewfinder Frame */
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="w-full h-full object-cover min-h-[320px]"
              />

              {/* Receipt Framing Guide Overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                <div className="relative w-[78%] h-[82%] border-2 border-dashed border-emerald-400/80 rounded-2xl shadow-[0_0_20px_rgba(52,211,153,0.3)] flex flex-col justify-between p-3">
                  {/* Four Corner Accents */}
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg"></div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg"></div>
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg"></div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-emerald-400 rounded-br-lg"></div>

                  <div className="text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-medium text-emerald-300">
                      Sejajarkan Struk di Sini
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white/60">
                      Pastikan teks dan angka total terlihat jelas
                    </span>
                  </div>
                </div>
              </div>

              {/* Switch Camera Button (if multiple cameras available) */}
              {hasMultipleCameras && (
                <button
                  type="button"
                  onClick={handleToggleFacingMode}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white/80 hover:text-white transition shadow-lg border border-white/10"
                  title="Ganti Kamera Depan/Belakang"
                >
                  <SwitchCamera className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#161616] border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
          {capturedBlob ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-2.5 px-4 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Foto Ulang</span>
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-[2] py-2.5 px-5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Gunakan & Pindai AI</span>
              </button>
            </>
          ) : !cameraError ? (
            <div className="w-full flex items-center justify-between gap-2">
              {/* Fallback to phone native camera app */}
              <button
                type="button"
                onClick={() => nativeCameraInputRef.current?.click()}
                className="py-2.5 px-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-[11px] font-medium transition flex items-center gap-1.5"
                title="Buka aplikasi kamera bawaan HP"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Kamera Bawaan HP</span>
                <span className="sm:hidden">App Kamera</span>
              </button>

              {/* Primary Shutter Button */}
              <button
                type="button"
                onClick={handleSnap}
                disabled={isCapturing}
                className="relative w-14 h-14 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform bg-white/10 shadow-lg cursor-pointer mx-auto"
                aria-label="Jepret Foto Struk"
              >
                <div className="w-10 h-10 rounded-full bg-white transition" />
              </button>

              {/* Switch to gallery upload if callback provided */}
              {onSwitchToUpload ? (
                <button
                  type="button"
                  onClick={() => {
                    stopStream();
                    onClose();
                    onSwitchToUpload();
                  }}
                  className="py-2.5 px-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-[11px] font-medium transition flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Unggah Berkas</span>
                  <span className="sm:hidden">Galeri</span>
                </button>
              ) : (
                <div className="w-20"></div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}
