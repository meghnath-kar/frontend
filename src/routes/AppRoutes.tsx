import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import SearchCourses from '../pages/SearchCourses';

const AppRoutes: React.FC = () => (
  <Routes> 
    <Route path="/" element={<Layout />}>
      <Route path="search" element={<SearchCourses />} />
    </Route>
  </Routes>
);

export default AppRoutes;
