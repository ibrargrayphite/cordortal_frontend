"use client";

import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../hooks/useAuth';
import { PageLoader, ButtonLoader } from '../components/LoadingSpinner';
import styles from './login.module.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const { loading, authenticated, initialLoading, login, logout } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  // Show loading screen while checking authentication
  if (initialLoading) {
    return <PageLoader message="Checking authentication..." />;
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCardWrapper}>
        <div className={`${styles.loginCard} ${styles.fadeIn}`}>

          {/* Modern Login Header */}
          <div className={styles.loginHeader}>
            <div className={styles.logoContainer}>
              <div className={styles.logoIcon}>
                <i className="fas fa-user-md"></i>
              </div>
            </div>
            <h1 className={styles.loginTitle}>Welcome Back</h1>
            <p className={styles.loginSubtitle}>Sign in to your clinic dashboard</p>
          </div>

          {/* Logout Button - Show only when authenticated */}
          {/* {authenticated && (
                <div className={styles.logoutSection}>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={logout}
                    className={styles.logoutButton}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </Button>
                </div>
              )} */}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className="mb-4">
              <Label htmlFor="username" className={styles.formLabel}>
                Username
              </Label>
              <div className={styles.inputWrapper}>
                <i className={`fas fa-user ${styles.inputIcon}`}></i>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className={styles.formInput}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="password" className={styles.formLabel}>
                Password
              </Label>
              <div className={styles.inputWrapper}>
                <i className={`fas fa-lock ${styles.inputIcon}`}></i>
                <Input
                  id="password"
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
            </div>

            <Button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <ButtonLoader />
              ) : (
                <>
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Sign In
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 