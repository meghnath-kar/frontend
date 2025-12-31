import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from '../pages/Home';
import Courses from '../pages/Courses';
import AddCourse from '../pages/AddCourse';
import SearchCourses from '../pages/SearchCourses';

const AppRoutes: React.FC = () => (
  <Routes> 
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="courses" element={<Courses />} />
      <Route path="add-course" element={<AddCourse />} />
      <Route path="search" element={<SearchCourses />} />
    </Route>
  </Routes>
);

export default AppRoutes;
