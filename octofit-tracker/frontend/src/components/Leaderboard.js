import React, { useCallback, useEffect, useState } from 'react';

function Leaderboard() {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`
    : '/api/leaderboard/';

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = useCallback(async () => {
    console.log('[Leaderboard] REST API endpoint:', endpoint);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      console.log('[Leaderboard] Raw fetched data:', data);
      const items = Array.isArray(data) ? data : data.results || [];
      console.log('[Leaderboard] Normalized leaderboard list:', items);
      setEntries(items);
    } catch (err) {
      console.error('[Leaderboard] Error fetching data:', err);
      setError('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    console.log('[Leaderboard] Manual refresh triggered');
    fetchData();
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
  };

  const openModal = (entry) => {
    console.log('[Leaderboard] Open details modal for:', entry);
    setSelectedEntry(entry);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEntry(null);
  };

  const normalizedEntries = Array.isArray(entries) ? entries : [];
  const filteredEntries = normalizedEntries.filter((entry) => {
    const name = (
      entry.username ||
      entry.name ||
      entry.id ||
      ''
    )
      .toString()
      .toLowerCase();
    return name.includes(filterText.toLowerCase());
  });

  return (
    <div className="card app-card">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h2 className="h5 mb-0">Leaderboard</h2>
        <button type="button" className="btn btn-light btn-sm" onClick={handleRefresh}>
          Refresh
        </button>
      </div>
      <div className="card-body">
        <form className="row g-2 mb-3" onSubmit={handleFilterSubmit}>
          <div className="col-sm-8 col-md-10">
            <input
              type="text"
              className="form-control"
              placeholder="Filter leaderboard..."
              value={filterText}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-sm-4 col-md-2 d-grid">
            <button type="submit" className="btn btn-primary">
              Apply
            </button>
          </div>
        </form>

        {loading && <p>Loading leaderboard...</p>}
        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Participant</th>
                  <th scope="col">Score</th>
                  <th scope="col" className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, index) => (
                  <tr key={entry.id || entry.username || index}>
                    <td>{index + 1}</td>
                    <td>{entry.username || entry.name || 'Participant'}</td>
                    <td>{entry.score || entry.points || 0}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openModal(entry)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredEntries.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No leaderboard entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && selectedEntry && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Leaderboard entry details</h5>
                  <button type="button" className="btn-close" onClick={closeModal} aria-label="Close" />
                </div>
                <div className="modal-body">
                  <pre className="mb-0">
                    <code>{JSON.stringify(selectedEntry, null, 2)}</code>
                  </pre>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </div>
  );
}

export default Leaderboard;
