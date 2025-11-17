import './RouletteWheel.css';

const baseColors = ['#f94144', '#f3722c', '#f8961e', '#f9844a', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];

const buildGradient = (items) => {
  if (!items.length) {
    return '#1f2430';
  }
  const segments = items.map((_, index) => {
    const color = baseColors[index % baseColors.length];
    const start = (index / items.length) * 100;
    const end = ((index + 1) / items.length) * 100;
    return `${color} ${start}% ${end}%`;
  });
  return `conic-gradient(${segments.join(', ')})`;
};

export default function RouletteWheel({ items, rotation, spinning }) {
  return (
    <div className="roulette">
      <div className="roulette__pointer" />
      <div
        className={`roulette__wheel${spinning ? ' roulette__wheel--spinning' : ''}`}
        style={{
          transform: `rotate(${rotation}deg)`,
          background: buildGradient(items),
        }}
      >
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="roulette__label"
            style={{ '--item-index': index, '--item-count': items.length }}
          >
            <span>{item}</span>
          </div>
        ))}
        <div className="roulette__center" />
      </div>
    </div>
  );
}
