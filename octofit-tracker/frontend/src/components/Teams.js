import React, { useCallback, useEffect, useState } from 'react';

function Teams() {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
    : '/api/teams/';

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = useCallback(async () => {
    console.log('[Teams] REST API endpoint:', endpoint);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      console.log('[Teams] Raw fetched data:', data);
      const items = Array.isArray(data) ? data : data.results || [];
      console.log('[Teams] Normalized teams list:', items);
      setTeams(items);
    } catch (err) {
      console.error('[Teams] Error fetching data:', err);
      setError('Failed to load teams');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    console.log('[Teams] Manual refresh triggered');
    fetchData();
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
  };

  const openModal = (team) => {
    console.log('[Teams] Open details modal for:', team);
    setSelectedTeam(team);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTeam(null);
  };

  const normalizedTeams = Array.isArray(teams) ? teams : [];
  const filteredTeams = normalizedTeams.filter((team) => {
    const name = (team.name || team.id || '')
      .toString()
      .toLowerCase();
    return name.includes(filterText.toLowerCase());
  });

  return (
    <div className="card app-card">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h2 className="h5 mb-0">Teams</h2>
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
              placeholder="Filter teams..."
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

        {loading && <p>Loading teams...</p>}
        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Team</th>
                  <th scope="col" className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team, index) => (
                  <tr key={team.id || team.name || index}>
                    <td>{index + 1}</td>
                    <td>{team.name || 'Team'}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openModal(team)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredTeams.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No teams found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && selectedTeam && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Team details</h5>
                  <button type="button" className="btn-close" onClick={closeModal} aria-label="Close" />
                </div>
                <div className="modal-body">
                  <pre className="mb-0">
                    <code>{JSON.stringify(selectedTeam, null, 2)}</code>
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

export default Teams;
