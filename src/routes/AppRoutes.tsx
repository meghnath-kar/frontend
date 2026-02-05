import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../pages/Layout';
import SearchCourses from '../pages/SearchCourses';
import CourseDetail from '../pages/CourseDetail';
import UserLogin from '../pages/UserLogin';
import UserRegister from '../pages/UserRegister';
import ProtectedRoute from './ProtectedRoute';
import AddCourse from '../pages/AddCourse';

const AppRoutes: React.FC = () => (
  <Routes>
    {/** User Routes */}
    <Route path="/" element={<Layout />}>
      <Route index element={<SearchCourses />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/register" element={<UserRegister />} />
      <Route path="search" element={<SearchCourses />} />
      <Route path="course/:slug" element={<CourseDetail />} />
      <Route path='course/add' element={<ProtectedRoute redirectTo='/login'><AddCourse /></ProtectedRoute>} />
    </Route>
    
    {/** Admin Routes */}
    <Route path="/admin" element={<p>Admin Layout</p>}>
    </Route>
  </Routes>
);

export default AppRoutes;

