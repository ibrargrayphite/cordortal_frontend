"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { setTokens, isAuthenticated, logout } from '../utils/auth';
import styles from './login.module.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Ensure no trailing slash in the URL
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const loginUrl = `${baseUrl}/login/`;
      
      console.log('Making login request to:', loginUrl);
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();
      console.log('Login response:', response.status, data);

      if (response.ok) {
        // Store tokens using utility function
        setTokens(data.access, data.refresh);
        setAuthenticated(true);
        
        // Use window.location.href instead of router.push to avoid React DOM conflicts
        window.location.href = '/';
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    // Use window.location.href for logout as well
    window.location.href = '/leads';
  };

  return (
    <div className={styles.loginContainer}>
      <Container fluid>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <div className={styles.loginCard}>
              
              {/* Logout Button - Show only when authenticated */}
              {authenticated && (
                <div className={styles.logoutSection}>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleLogout}
                    className={styles.logoutButton}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </Button>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <Alert variant="danger" className={styles.errorAlert}>
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              {/* Login Form */}
              <Form onSubmit={handleSubmit} className={styles.loginForm}>
                <Form.Group className="mb-4">
                  <Form.Label className={styles.formLabel}>
                    Username
                  </Form.Label>
                  <div className={styles.inputWrapper}>
                    <i className={`fas fa-user ${styles.inputIcon}`}></i>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter your username"
                      className={styles.formInput}
                      required
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className={styles.formLabel}>
                    Password
                  </Form.Label>
                  <div className={styles.inputWrapper}>
                    <i className={`fas fa-lock ${styles.inputIcon}`}></i>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className={styles.formInput}
                      required
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </Form.Group>

                <Button
                  type="submit"
                  className={styles.loginButton}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Sign In
                    </>
                  )}
                </Button>
              </Form>

              
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage; 