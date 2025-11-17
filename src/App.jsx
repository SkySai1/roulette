import { useMemo, useState } from 'react';
import './App.css';

const MAX_NUMBER = 36;

function spinRoulette() {
  return Math.floor(Math.random() * (MAX_NUMBER + 1));
}

const buildHistory = (value, history) => {
  const next = [value, ...history];
  return next.slice(0, 10);
};

export default function App() {
  const [current, setCurrent] = useState(spinRoulette());
  const [history, setHistory] = useState([]);

  const color = useMemo(() => {
    if (current === 0) return 'green';
    return current % 2 === 0 ? 'black' : 'red';
  }, [current]);

  const handleSpin = () => {
    const value = spinRoulette();
    setCurrent(value);
    setHistory((prev) => buildHistory(value, prev));
  };

  return (
    <div className="app">
      <h1>Roulette</h1>
      <div className={`wheel wheel--${color}`}>
        <span className="wheel__value">{current}</span>
      </div>
      <button type="button" onClick={handleSpin}>
        Spin
      </button>
      <section className="history">
        <h2>Last results</h2>
        <ul>
          {history.map((value, index) => (
            <li key={`${value}-${index}`} className={`history__value history__value--${value % 2 === 0 ? 'black' : 'red'}`}>
              {value}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
