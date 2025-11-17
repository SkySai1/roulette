import { useMemo, useState, useEffect } from 'react';
import RouletteWheel from './components/RouletteWheel.jsx';
import AssignmentsTable from './components/AssignmentsTable.jsx';
import './styles/app.css';

const defaultParticipants = ['Анна', 'Богдан', 'Кирилл', 'Марина'];
const defaultResults = ['Большой приз', 'Сертификат', 'Пицца', 'Мерч'];

const parseList = (value) =>
  value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

export default function App() {
  const [participantsInput, setParticipantsInput] = useState(defaultParticipants.join('\n'));
  const [resultsInput, setResultsInput] = useState(defaultResults.join('\n'));
  const [mode, setMode] = useState('standard');
  const [assignments, setAssignments] = useState({});
  const [activeParticipant, setActiveParticipant] = useState(defaultParticipants[0]);
  const [wheelItems, setWheelItems] = useState(defaultResults);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [lastResult, setLastResult] = useState('');

  const participants = useMemo(() => parseList(participantsInput), [participantsInput]);
  const results = useMemo(() => parseList(resultsInput), [resultsInput]);

  const assignedResults = useMemo(() => Object.values(assignments), [assignments]);

  const remainingResults = useMemo(
    () => results.filter((result) => !assignedResults.includes(result)),
    [results, assignedResults]
  );

  useEffect(() => {
    setAssignments({});
    setActiveParticipant(participants[0] ?? '');
  }, [participantsInput, resultsInput]);

  useEffect(() => {
    if (!spinning) {
      setWheelItems(mode === 'distribution' ? remainingResults : results);
    }
  }, [mode, results, remainingResults, spinning]);

  const spinDuration = 4500;

  const nextUnassignedParticipant = (currentAssignments) =>
    participants.find((person) => !currentAssignments[person]) ?? '';

  const canSpin = () => {
    if (spinning) return false;
    if (mode === 'distribution') {
      return remainingResults.length > 0 && (activeParticipant || nextUnassignedParticipant(assignments));
    }
    return results.length > 0;
  };

  const handleSpin = () => {
    if (!canSpin()) return;

    const participantForSpin =
      mode === 'distribution' ? activeParticipant || nextUnassignedParticipant(assignments) : null;

    const itemsForSpin = mode === 'distribution' ? remainingResults : results;
    if (!itemsForSpin.length) return;

    setWheelItems(itemsForSpin);

    const sliceAngle = 360 / itemsForSpin.length;
    const targetIndex = Math.floor(Math.random() * itemsForSpin.length);
    const targetValue = itemsForSpin[targetIndex];
    const extraTurns = 6 + Math.random() * 4;
    const targetRotation = rotation - (targetIndex * sliceAngle + sliceAngle / 2) + extraTurns * 360;

    setRotation(targetRotation);
    setSpinning(true);

    setTimeout(() => {
      setSpinning(false);
      setLastResult(targetValue);

      if (mode === 'distribution' && participantForSpin) {
        setAssignments((prev) => {
          const updated = { ...prev, [participantForSpin]: targetValue };
          setActiveParticipant(nextUnassignedParticipant(updated));
          return updated;
        });
      }
    }, spinDuration);
  };

  const handleModeChange = (value) => {
    setMode(value);
    if (value === 'standard') {
      setActiveParticipant('');
    } else {
      setActiveParticipant(nextUnassignedParticipant(assignments));
    }
  };

  const resetAssignments = () => {
    setAssignments({});
    setActiveParticipant(participants[0] ?? '');
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <h1>Онлайн рулетка</h1>
          <p>Загрузите участников и возможные результаты, выберите режим и запускайте колесо.</p>
        </div>
        <div className="modes">
          <label>
            <input
              type="radio"
              name="mode"
              value="standard"
              checked={mode === 'standard'}
              onChange={(event) => handleModeChange(event.target.value)}
            />
            Обычная рулетка
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              value="distribution"
              checked={mode === 'distribution'}
              onChange={(event) => handleModeChange(event.target.value)}
            />
            Распределяющая рулетка
          </label>
        </div>
      </header>

      <main className="content">
        <section className="panel">
          <h2>Данные</h2>
          <div className="inputs-grid">
            <label>
              <span>Участники</span>
              <textarea
                value={participantsInput}
                onChange={(event) => setParticipantsInput(event.target.value)}
                placeholder="Каждый участник с новой строки"
              />
            </label>
            <label>
              <span>Результаты</span>
              <textarea
                value={resultsInput}
                onChange={(event) => setResultsInput(event.target.value)}
                placeholder="Каждый результат с новой строки"
              />
            </label>
          </div>
          {mode === 'distribution' && (
            <div className="distribution-bar">
              <div>
                <span>Активный участник:</span>
                <select
                  value={activeParticipant}
                  onChange={(event) => setActiveParticipant(event.target.value)}
                >
                  <option value="">Выберите...</option>
                  {participants.map((person) => (
                    <option key={person} value={person} disabled={Boolean(assignments[person])}>
                      {person}
                    </option>
                  ))}
                </select>
              </div>
              <button type="button" onClick={resetAssignments} className="ghost">
                Сбросить распределение
              </button>
            </div>
          )}
        </section>

        <section className="panel wheel-panel">
          <div className="wheel-wrapper">
            <RouletteWheel items={wheelItems} rotation={rotation} spinning={spinning} />
            <div className="wheel-actions">
              <button type="button" onClick={handleSpin} disabled={!canSpin()}>
                Крутить колесо
              </button>
              <p className="result-line">
                {lastResult ? `Последний результат: ${lastResult}` : 'Результат появится после вращения'}
              </p>
            </div>
          </div>
        </section>
      </main>

      {mode === 'distribution' && (
        <AssignmentsTable participants={participants} assignments={assignments} />
      )}
    </div>
  );
}
