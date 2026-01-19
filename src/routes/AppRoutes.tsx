import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../pages/Layout';
import SearchCourses from '../pages/SearchCourses';
import CourseDetail from '../pages/CourseDetail';
import UserLogin from '../pages/UserLogin';
import Admin from '../pages/admin/Admin';
import AdminLogin from '../pages/admin/AdminLogin';
import Dashboard from '../pages/admin/Dashboard';
import ManageCourses from '../pages/admin/ManageCourses';
import AddCoursePage from '../pages/admin/AddCoursePage';
import EditCoursePage from '../pages/admin/EditCoursePage';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageCategories from '../pages/admin/ManageCategories';
import Settings from '../pages/admin/Settings';
import ProtectedRoute from './ProtectedRoute';
import AddCourse from '../pages/AddCourse';

const AppRoutes: React.FC = () => (
  <Routes>
    {/** User Login Route */}
    
    <Route path="/" element={<Layout />}>
      <Route path="/login" element={<UserLogin />} />
      <Route path="search" element={<SearchCourses />} />
      <Route path="course/:slug" element={<CourseDetail />} />
      <Route path='course/add' element={<ProtectedRoute redirectTo='/login'><AddCourse /></ProtectedRoute>} />
    </Route>
    
    {/** Admin Routes */}
    <Route path="/admin" element={<Admin />}>
      <Route index element={<AdminLogin />} />
      <Route path="dashboard" element={<ProtectedRoute requireAdmin={true} redirectTo="/admin"><Dashboard /></ProtectedRoute>} />
      <Route path="courses" element={<ProtectedRoute requireAdmin={true} redirectTo="/admin"><ManageCourses /></ProtectedRoute>} />
      <Route path="courses/add" element={<ProtectedRoute requireAdmin={true} redirectTo="/admin"><AddCoursePage /></ProtectedRoute>} />
      <Route path="courses/edit/:id" element={<ProtectedRoute requireAdmin={true} redirectTo="/admin"><EditCoursePage /></ProtectedRoute>} />
      <Route path="users" element={<ProtectedRoute requireAdmin={true} redirectTo="/admin"><ManageUsers /></ProtectedRoute>} />
      <Route path="categories" element={<ProtectedRoute requireAdmin={true} redirectTo="/admin"><ManageCategories /></ProtectedRoute>} />
      <Route path="settings" element={<ProtectedRoute requireAdmin={true} redirectTo="/admin"><Settings /></ProtectedRoute>} />
    </Route>
  </Routes>
);

export default AppRoutes;
