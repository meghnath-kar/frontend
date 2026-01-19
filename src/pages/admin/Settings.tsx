import React, { useState } from 'react';
import './Settings.scss';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'Course Platform',
    siteEmail: 'admin@courseplatform.com',
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save settings to API
    console.log('Saving settings:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p className="text-muted">Manage your application settings</p>
      </div>

      <div className="settings-card">
        <form onSubmit={handleSubmit}>
          <div className="settings-section">
            <h3>General Settings</h3>
            
            <div className="mb-3">
              <label htmlFor="siteName" className="form-label">
                Site Name
              </label>
              <input
                type="text"
                className="form-control"
                id="siteName"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="siteEmail" className="form-label">
                Site Email
              </label>
              <input
                type="email"
                className="form-control"
                id="siteEmail"
                name="siteEmail"
                value={settings.siteEmail}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="settings-section">
            <h3>System Settings</h3>

            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="maintenanceMode"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="maintenanceMode">
                Maintenance Mode
                <small className="d-block text-muted">
                  Enable this to make the site unavailable for regular users
                </small>
              </label>
            </div>

            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="allowRegistration"
                name="allowRegistration"
                checked={settings.allowRegistration}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="allowRegistration">
                Allow User Registration
                <small className="d-block text-muted">
                  Allow new users to register on the platform
                </small>
              </label>
            </div>

            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="emailNotifications">
                Email Notifications
                <small className="d-block text-muted">
                  Send email notifications to users
                </small>
              </label>
            </div>
          </div>

          <div className="form-actions">
            {saved && (
              <div className="alert alert-success" role="alert">
                <i className="bi bi-check-circle me-2"></i>
                Settings saved successfully!
              </div>
            )}
            <button type="submit" className="btn btn-primary">
              <i className="bi bi-save me-2"></i>
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
