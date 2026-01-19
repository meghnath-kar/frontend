import React, { useEffect, useState } from 'react';
import './Dashboard.scss';

interface Stats {
  totalCourses: number;
  totalUsers: number;
  totalCategories: number;
  activeCourses: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalCourses: 0,
    totalUsers: 0,
    totalCategories: 0,
    activeCourses: 0
  });

  useEffect(() => {
    // TODO: Fetch real stats from API
    setStats({
      totalCourses: 150,
      totalUsers: 1250,
      totalCategories: 12,
      activeCourses: 142
    });
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="text-muted">Welcome to the admin dashboard</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">
            <i className="bi bi-book"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalCourses}</h3>
            <p>Total Courses</p>
          </div>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon">
            <i className="bi bi-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.activeCourses}</h3>
            <p>Active Courses</p>
          </div>
        </div>

        <div className="stat-card stat-card-info">
          <div className="stat-icon">
            <i className="bi bi-people"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card stat-card-warning">
          <div className="stat-icon">
            <i className="bi bi-tags"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.totalCategories}</h3>
            <p>Categories</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="row">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h5>Recent Activity</h5>
              </div>
              <div className="card-body">
                <div className="activity-list">
                  <div className="activity-item">
                    <i className="bi bi-plus-circle text-success"></i>
                    <div>
                      <strong>New course added:</strong> Advanced TypeScript
                      <small className="text-muted d-block">2 hours ago</small>
                    </div>
                  </div>
                  <div className="activity-item">
                    <i className="bi bi-person-plus text-info"></i>
                    <div>
                      <strong>New user registered:</strong> john.doe@example.com
                      <small className="text-muted d-block">5 hours ago</small>
                    </div>
                  </div>
                  <div className="activity-item">
                    <i className="bi bi-pencil text-warning"></i>
                    <div>
                      <strong>Course updated:</strong> React Fundamentals
                      <small className="text-muted d-block">1 day ago</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5>Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <a href="/admin/courses/add" className="btn btn-primary">
                    <i className="bi bi-plus-circle me-2"></i>
                    Add New Course
                  </a>
                  <a href="/admin/users" className="btn btn-outline-primary">
                    <i className="bi bi-people me-2"></i>
                    Manage Users
                  </a>
                  <a href="/admin/categories" className="btn btn-outline-primary">
                    <i className="bi bi-tags me-2"></i>
                    Manage Categories
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
