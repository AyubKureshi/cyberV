const Card = ({ title, children, className = "" }) => {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-[0_24px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl ${className}`}
    >
      {title ? (
        <h2 className="mb-2 text-lg font-semibold text-slate-100">{title}</h2>
      ) : null}
      {children}
    </div>
  );
};

export default Card;
