import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Icon } from '../../shared/components/UI';

interface CertificateModalProps {
  user: any;
  submission: any;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ user, submission, onClose }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    setIsGenerating(true);
    try {
      await document.fonts.ready;
      const element = certificateRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        logging: false,
        onclone: (clonedDoc) => {
          const sanitize = (str: string) => str.replace(/(oklch|oklab|color|hwb)\([^)]+\)/g, '#064e3b');

          const previewContainer = clonedDoc.querySelector('.preview-scale-container') as HTMLDivElement;
          if (previewContainer) {
            previewContainer.style.transform = 'none';
          }

          const styles = Array.from(clonedDoc.querySelectorAll('style, link[rel="stylesheet"]'));
          styles.forEach(style => {
            if (style.tagName.toLowerCase() === 'style') {
              if (style.textContent && /(oklch|oklab|color\()/.test(style.textContent)) {
                style.remove();
              } else if (style.textContent) {
                style.textContent = sanitize(style.textContent);
              }
            } else if (style.tagName.toLowerCase() === 'link') {
              const href = (style as HTMLLinkElement).href;
              if (!href.includes('fonts.googleapis.com')) {
                style.remove();
              }
            }
          });

          const allElements = Array.from(clonedDoc.getElementsByTagName('*'));
          allElements.forEach(el => {
            const htmlEl = el as HTMLElement;
            if (htmlEl.style && htmlEl.style.cssText) {
              if (/(oklch|oklab|display-p3|color\(|hwb\()/.test(htmlEl.style.cssText)) {
                htmlEl.style.cssText = sanitize(htmlEl.style.cssText);
              }
            }
          });
        }
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `ForestGift-Certificate-${user?.name || 'Pledge'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Certificate generation failed:", error);
      alert("Failed to generate certificate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const scale = typeof window !== 'undefined' ? Math.max(0.2, Math.min(0.85, (window.innerWidth - 32) / 794)) : 0.85;
  const marginLossY = 1123 * (1 - scale);

  const treeCount = submission?.treeCount || user?.trees || '10';

  return (
    <>
      <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-sm animate-in fade-in duration-500 pointer-events-none" />

      <div className="fixed inset-0 z-[2005] flex flex-col items-center justify-start py-8 px-2 md:px-8 overflow-y-auto overflow-x-hidden animate-in fade-in duration-500 pb-40">
        <div className="w-full flex-none flex flex-col items-center justify-start min-h-max">
          <style>
            {`
              .cert-container * {
                border-color: transparent !important;
                outline-color: transparent !important;
                text-decoration-color: transparent !important;
                caret-color: transparent !important;
                column-rule-color: transparent !important;
                -webkit-tap-highlight-color: transparent !important;
              }
            `}
          </style>
          <div className="preview-scale-container cert-container relative w-fit h-fit overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.1)] border border-white/20" style={{ transform: `scale(${scale})`, transformOrigin: 'top center', marginBottom: `-${marginLossY}px` }}>
            <div
              ref={certificateRef}
              style={{
                position: 'relative',
                width: '794px',
                height: '1123px',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                userSelect: 'none',
                color: '#000000', // Base color to override any root oklch
              }}
            >
              {/* Full Background Template */}
              <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
                <img src="/FORESTGIFT CERTIFICATE TEMPLATE@3x.png" style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: 'transparent' }} alt="" crossOrigin="anonymous" />
              </div>

              {/* Dynamic Name Overlay */}
              <div style={{ position: 'absolute', bottom: '565px', left: '0px', width: '794px', padding: '0 60px', boxSizing: 'border-box', textAlign: 'center', zIndex: 10, backgroundColor: 'transparent' }}>
                <h1 style={{ fontSize: '46px', color: '#014d24', fontFamily: "'Inter', sans-serif", fontWeight: '900', margin: 0, letterSpacing: '2px', lineHeight: '1.2', textTransform: 'uppercase', textAlign: 'center', width: '100%', wordBreak: 'break-word', backgroundColor: 'transparent' }}>
                  {user?.name || 'RUPAK KUMAR GOUDA'}
                </h1>
              </div>

              {/* Dynamic Tree Count Overlay */}
              <div style={{ position: 'absolute', bottom: '165px', left: '0px', width: '794px', textAlign: 'center', zIndex: 10, backgroundColor: 'transparent' }}>
                <span style={{ color: '#ffffff', fontSize: '100px', fontWeight: 'bold', fontFamily: "'Playfair Display', serif", lineHeight: '1', backgroundColor: 'transparent' }}>
                  {treeCount}
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 z-[2020] pointer-events-none animate-in fade-in duration-500">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-colors shadow-2xl border border-white/10 pointer-events-auto"
        >
          <span className="sr-only">Close Preview</span>
          <Icon name="x" size={24} />
        </button>

        <div className="absolute bottom-20 md:bottom-12 left-4 right-4 md:left-1/2 md:right-auto md:w-auto md:-translate-x-1/2 flex flex-row md:gap-8 no-print bg-black/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border border-white/10 md:border-none p-3 md:p-0 rounded-2xl md:rounded-none pointer-events-auto shadow-2xl md:shadow-none">
          <button
            onClick={downloadCertificate}
            disabled={isGenerating}
            className="flex-1 md:flex-none bg-[#0a4f2b] text-white py-4 md:px-12 md:py-5 rounded-xl md:rounded-none text-[10px] md:text-sm font-black uppercase tracking-widest md:tracking-[0.4em] hover:bg-black transition-all flex items-center justify-center gap-2 md:gap-6 shadow-2xl group border border-[#ffffff1a] disabled:opacity-50 mr-2 md:mr-0"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-4 border-[#ffffff33] border-t-white rounded-full animate-spin mx-auto"></div>
            ) : (
              <>
                <Icon name="download" size={16} className="group-hover:-translate-y-1 transition-transform" />
                Download Certificate
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="flex-1 md:flex-none bg-zinc-800 text-white py-4 md:px-12 md:py-5 rounded-xl md:rounded-none text-[10px] md:text-sm font-black uppercase tracking-widest md:tracking-[0.2em] hover:bg-zinc-700 transition-all shadow-xl border border-none"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

