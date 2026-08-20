/** Continuous ticker strip. The track is duplicated so the loop is seamless. */
export default function Marquee({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  const track = [...items, ...items];

  return (
    <div className={`overflow-hidden border-y border-hairline py-4 ${className}`}>
      <div className="flex w-max animate-marquee">
        {track.map((item, i) => (
          <span key={`${item}-${i}`} className="meta flex items-center gap-6 px-6 text-ink/45">
            {item}
            <span className="text-accent" aria-hidden="true">
              ✳
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
