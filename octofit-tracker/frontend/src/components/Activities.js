import React, { useCallback, useEffect, useState } from 'react';

function Activities() {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/activities/`
    : '/api/activities/';

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = useCallback(async () => {
    console.log('[Activities] REST API endpoint:', endpoint);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      console.log('[Activities] Raw fetched data:', data);
      const items = Array.isArray(data) ? data : data.results || [];
      console.log('[Activities] Normalized activities list:', items);
      setActivities(items);
    } catch (err) {
      console.error('[Activities] Error fetching data:', err);
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    console.log('[Activities] Manual refresh triggered');
    fetchData();
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
  };

  const openModal = (activity) => {
    console.log('[Activities] Open details modal for:', activity);
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
  };

  const normalizedActivities = Array.isArray(activities) ? activities : [];
  const filteredActivities = normalizedActivities.filter((activity) => {
    const name = (
      activity.name ||
      activity.title ||
      activity.username ||
      activity.id ||
      ''
    )
      .toString()
      .toLowerCase();
    return name.includes(filterText.toLowerCase());
  });

  return (
    <div className="card app-card">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h2 className="h5 mb-0">Activities</h2>
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
              placeholder="Filter activities..."
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

        {loading && <p>Loading activities...</p>}
        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Activity</th>
                  <th scope="col" className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map((activity, index) => (
                  <tr key={activity.id || activity.name || index}>
                    <td>{index + 1}</td>
                    <td>{activity.name || activity.title || 'Activity'}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openModal(activity)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredActivities.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No activities found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && selectedActivity && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Activity details</h5>
                  <button type="button" className="btn-close" onClick={closeModal} aria-label="Close" />
                </div>
                <div className="modal-body">
                  <pre className="mb-0">
                    <code>{JSON.stringify(selectedActivity, null, 2)}</code>
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

export default Activities;
