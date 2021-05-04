import React, { useState } from 'react';
import { Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

function Dashboard({ history }) {
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  async function handleLogout() {
    setError('');
    try {
      await logout();
      history.push('/login');
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email: </strong> {currentUser.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Update Profile
          </Link>
        </Card.Body>
        <div className="w-100 text-center mt-2">
          <Button variant="link" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </Card>
    </>
  );
}

export default Dashboard;
