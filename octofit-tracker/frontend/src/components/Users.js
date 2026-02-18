import React, { useCallback, useEffect, useState } from 'react';

function Users() {
  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/users/`
    : '/api/users/';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = useCallback(async () => {
    console.log('[Users] REST API endpoint:', endpoint);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      console.log('[Users] Raw fetched data:', data);
      const items = Array.isArray(data) ? data : data.results || [];
      console.log('[Users] Normalized users list:', items);
      setUsers(items);
    } catch (err) {
      console.error('[Users] Error fetching data:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    console.log('[Users] Manual refresh triggered');
    fetchData();
  };

  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };

  const handleFilterSubmit = (event) => {
    event.preventDefault();
  };

  const openModal = (user) => {
    console.log('[Users] Open details modal for:', user);
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const normalizedUsers = Array.isArray(users) ? users : [];
  const filteredUsers = normalizedUsers.filter((user) => {
    const name = (user.username || user.email || user.id || '')
      .toString()
      .toLowerCase();
    return name.includes(filterText.toLowerCase());
  });

  return (
    <div className="card app-card">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h2 className="h5 mb-0">Users</h2>
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
              placeholder="Filter users..."
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

        {loading && <p>Loading users...</p>}
        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">User</th>
                  <th scope="col">Email</th>
                  <th scope="col" className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id || user.username || index}>
                    <td>{index + 1}</td>
                    <td>{user.username || 'User'}</td>
                    <td>{user.email || '-'}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openModal(user)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && selectedUser && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">User details</h5>
                  <button type="button" className="btn-close" onClick={closeModal} aria-label="Close" />
                </div>
                <div className="modal-body">
                  <pre className="mb-0">
                    <code>{JSON.stringify(selectedUser, null, 2)}</code>
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

export default Users;
