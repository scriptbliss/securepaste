export default function LoadingDots() {
  return (
    <span className="inline-flex space-x-1">
      <span className="animate-bounce">.</span>
      <span className="animate-bounce animation-delay-200">.</span>
      <span className="animate-bounce animation-delay-400">.</span>
      <style jsx>{`
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
      `}</style>
    </span>
  );
}
