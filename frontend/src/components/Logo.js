import { Link } from "react-router-dom";

export const Logo = ({ size = "default", linkTo = "/" }) => {
  const sizeClasses = {
    small: "text-xl",
    default: "text-2xl",
    large: "text-3xl",
  };

  const LogoContent = () => (
    <div className={`font-display font-bold ${sizeClasses[size]} tracking-tight`}>
      <span className="text-[#0A1628]">Londway</span>
      <span className="text-[#C9A227]">Fond</span>
      <span className="text-[#64748B] text-xs ml-1 font-normal tracking-wider uppercase">Bank</span>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-block hover:opacity-90 transition-opacity" data-testid="logo-link">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
};

export const LogoMark = ({ className = "" }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="w-10 h-10 rounded-lg bg-[#0A1628] flex items-center justify-center">
      <span className="font-display font-bold text-[#C9A227] text-lg">LF</span>
    </div>
  </div>
);
