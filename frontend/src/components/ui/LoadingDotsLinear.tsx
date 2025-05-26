export default function LoadingDotsLinear() {
  return (
    <span className="inline-flex space-x-1" aria-label="Loading" role="status">
      <span className="dot dot-1">.</span>
      <span className="dot dot-2">.</span>
      <span className="dot dot-3">.</span>
      <style jsx>{`
        .dot {
          animation: blink 1.4s infinite ease-in-out both;
          font-size: 1.5rem;
        }
        .dot-1 {
          animation-delay: 0s;
        }
        .dot-2 {
          animation-delay: 0.2s;
        }
        .dot-3 {
          animation-delay: 0.4s;
        }
        @keyframes blink {
          0%,
          80%,
          100% {
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
        }
      `}</style>
    </span>
  );
}
