import './AssignmentsTable.css';

export default function AssignmentsTable({ participants, assignments }) {
  if (!participants.length) {
    return null;
  }

  return (
    <section className="panel assignments">
      <h2>Распределение результатов</h2>
      <table>
        <thead>
          <tr>
            <th>Участник</th>
            <th>Результат</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => (
            <tr key={participant}>
              <td>{participant}</td>
              <td>{assignments[participant] ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
