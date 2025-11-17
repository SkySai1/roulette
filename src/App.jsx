import { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';

const DEFAULT_OPTIONS = ['Обед', 'Митап', 'Новый проект', 'Обучение', 'Ретро', 'Уикенд'];
const DEFAULT_PARTICIPANTS = ['Анна', 'Борис', 'Катя', 'Игорь', 'Мария', 'Сергей'];
const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#0ea5e9', '#6366f1', '#ec4899'];
const SPIN_DURATION = 4000;

let idCounter = 0;
const createOption = (label, index) => ({
  id: `option-${index}-${idCounter++}`,
  label,
  color: COLORS[index % COLORS.length],
});

const createParticipant = (label, index) => ({
  id: `participant-${index}-${idCounter++}`,
  label,
});

export default function App() {
  const [options, setOptions] = useState(() => DEFAULT_OPTIONS.map((label, index) => createOption(label, index)));
  const [participants, setParticipants] = useState(() =>
    DEFAULT_PARTICIPANTS.map((label, index) => createParticipant(label, index))
  );
  const [optionInput, setOptionInput] = useState('');
  const [participantInput, setParticipantInput] = useState('');
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [results, setResults] = useState([]);
  const spinTimeout = useRef(null);

  useEffect(() => {
    return () => {
      if (spinTimeout.current) {
        clearTimeout(spinTimeout.current);
      }
    };
  }, []);

  const handleAddOption = (event) => {
    event.preventDefault();
    const value = optionInput.trim();
    if (!value) return;
    setOptions((prev) => [...prev, createOption(value, prev.length)]);
    setOptionInput('');
  };

  const handleAddParticipant = (event) => {
    event.preventDefault();
    const value = participantInput.trim();
    if (!value) return;
    setParticipants((prev) => [...prev, createParticipant(value, prev.length)]);
    setParticipantInput('');
  };

  const handleDeleteOption = (id) => {
    setOptions((prev) => prev.filter((option) => option.id !== id));
  };

  const handleDeleteParticipant = (id) => {
    setParticipants((prev) => prev.filter((participant) => participant.id !== id));
  };

  const handleClearHistory = () => {
    setResults([]);
    setRotation(0);
  };

  const handleSpin = () => {
    if (isSpinning || options.length === 0 || participants.length === 0) {
      return;
    }

    const optionIndex = Math.floor(Math.random() * options.length);
    const participantIndex = Math.floor(Math.random() * participants.length);
    const chosenOption = options[optionIndex];
    const chosenParticipant = participants[participantIndex];
    const segmentAngle = 360 / options.length;
    const targetAngle = optionIndex * segmentAngle + segmentAngle / 2;

    setIsSpinning(true);
    setRotation((prevRotation) => {
      const normalized = prevRotation % 360;
      const desiredRotation = 360 - targetAngle;
      let adjustment = desiredRotation - normalized;
      if (adjustment <= 0) {
        adjustment += 360;
      }
      const randomSpins = Math.floor(Math.random() * 3) + 4;
      return prevRotation + randomSpins * 360 + adjustment;
    });

    if (spinTimeout.current) {
      clearTimeout(spinTimeout.current);
    }

    spinTimeout.current = setTimeout(() => {
      setResults((prev) => [{ participant: chosenParticipant, option: chosenOption }, ...prev].slice(0, 10));
      setParticipants((prev) => prev.filter((participant) => participant.id !== chosenParticipant.id));
      setOptions((prev) => prev.filter((option) => option.id !== chosenOption.id));
      setIsSpinning(false);
    }, SPIN_DURATION);
  };

  const wheelStyle = useMemo(() => {
    if (!options.length) {
      return {
        background: 'radial-gradient(circle, #1f2937, #0f172a)',
        transform: `rotate(${rotation}deg)`,
      };
    }

    const segments = options
      .map((option, index) => {
        const start = (index / options.length) * 100;
        const end = ((index + 1) / options.length) * 100;
        return `${option.color} ${start}% ${end}%`;
      })
      .join(', ');

    return {
      background: `conic-gradient(${segments})`,
      transform: `rotate(${rotation}deg)`,
    };
  }, [options, rotation]);

  return (
    <div className="app">
      <header>
        <h1>Командная рулетка</h1>
        <p>Добавьте варианты и участников, чтобы случайным образом распределить задачи.</p>
      </header>

      <div className="board">
        <section className="wheel-card">
          <div className="wheel-wrapper">
            <div className="wheel" style={wheelStyle}>
              {options.length > 0 && (
                <div className="wheel__labels">
                  {options.map((option, index) => {
                    const segmentAngle = 360 / options.length;
                    const angle = segmentAngle * index + segmentAngle / 2;
                    return (
                      <span key={option.id} className="wheel__label" style={{ transform: `rotate(${angle}deg)` }}>
                        <span style={{ transform: `rotate(${-angle}deg)` }}>{option.label}</span>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="wheel__pointer" />
          </div>
          <button type="button" onClick={handleSpin} disabled={isSpinning || !options.length || !participants.length}>
            {isSpinning ? 'Вращается...' : 'Крутить'}
          </button>
          {!options.length && <p className="muted">Добавьте хотя бы один вариант.</p>}
          {!participants.length && <p className="muted">Добавьте участников для нового круга.</p>}
        </section>

        <section className="panel">
          <h2>Варианты</h2>
          <form className="form" onSubmit={handleAddOption}>
            <input
              type="text"
              placeholder="Добавить вариант"
              value={optionInput}
              onChange={(event) => setOptionInput(event.target.value)}
            />
            <button type="submit">Добавить</button>
          </form>
          <ul className="list">
            {options.map((option) => (
              <li key={option.id} className="list__item">
                <div className="list__content">
                  <span className="list__dot" style={{ backgroundColor: option.color }} />
                  {option.label}
                </div>
                <button
                  type="button"
                  className="list__remove"
                  onClick={() => handleDeleteOption(option.id)}
                  aria-label={`Удалить вариант ${option.label}`}
                >
                  ×
                </button>
              </li>
            ))}
            {!options.length && <li className="muted">Список пуст</li>}
          </ul>
        </section>

        <section className="panel">
          <h2>Участники</h2>
          <form className="form" onSubmit={handleAddParticipant}>
            <input
              type="text"
              placeholder="Имя участника"
              value={participantInput}
              onChange={(event) => setParticipantInput(event.target.value)}
            />
            <button type="submit">Добавить</button>
          </form>
          <ul className="list">
            {participants.map((participant) => (
              <li key={participant.id} className="list__item">
                <div className="list__content">
                  <span className="list__dot list__dot--participant" />
                  {participant.label}
                </div>
                <button
                  type="button"
                  className="list__remove"
                  onClick={() => handleDeleteParticipant(participant.id)}
                  aria-label={`Удалить участника ${participant.label}`}
                >
                  ×
                </button>
              </li>
            ))}
            {!participants.length && <li className="muted">Нет свободных участников</li>}
          </ul>
        </section>
      </div>

      <section className="history">
        <div className="history__header">
          <h2>История распределений</h2>
          <button type="button" className="button--ghost" onClick={handleClearHistory} disabled={!results.length}>
            Очистить
          </button>
        </div>
        {results.length === 0 ? (
          <p className="muted">Здесь будут появляться результаты последних 10 вращений.</p>
        ) : (
          <ul>
            {results.map((item, index) => (
              <li key={`${item.participant.id}-${item.option.id}-${index}`}>
                <strong>{item.participant.label}</strong> → {item.option.label}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
