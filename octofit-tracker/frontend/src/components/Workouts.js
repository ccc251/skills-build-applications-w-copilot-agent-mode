import React, { useCallback, useEffect, useState } from 'react';

function Workouts() {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/workouts/`
    : '/api/workouts/';

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = useCallback(async () => {
    console.log('[Workouts] REST API endpoint:', endpoint);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      console.log('[Workouts] Raw fetched data:', data);
      const items = Array.isArray(data) ? data : data.results || [];
      console.log('[Workouts] Normalized workouts list:', items);
      setWorkouts(items);
    } catch (err) {
      console.error('[Workouts] Error fetching data:', err);
      setError('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    console.log('[Workouts] Manual refresh triggered');
    fetchData();
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
  };

  const openModal = (workout) => {
    console.log('[Workouts] Open details modal for:', workout);
    setSelectedWorkout(workout);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedWorkout(null);
  };

  const normalizedWorkouts = Array.isArray(workouts) ? workouts : [];
  const filteredWorkouts = normalizedWorkouts.filter((workout) => {
    const name = (workout.name || workout.title || workout.id || '')
      .toString()
      .toLowerCase();
    return name.includes(filterText.toLowerCase());
  });

  return (
    <div className="card app-card">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h2 className="h5 mb-0">Workouts</h2>
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
              placeholder="Filter workouts..."
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

        {loading && <p>Loading workouts...</p>}
        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Workout</th>
                  <th scope="col" className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkouts.map((workout, index) => (
                  <tr key={workout.id || workout.name || index}>
                    <td>{index + 1}</td>
                    <td>{workout.name || workout.title || 'Workout'}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openModal(workout)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredWorkouts.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No workouts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && selectedWorkout && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Workout details</h5>
                  <button type="button" className="btn-close" onClick={closeModal} aria-label="Close" />
                </div>
                <div className="modal-body">
                  <pre className="mb-0">
                    <code>{JSON.stringify(selectedWorkout, null, 2)}</code>
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

export default Workouts;
