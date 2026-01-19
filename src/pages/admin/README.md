# Admin Section

This directory contains all the admin-related components and pages for managing the course platform.

## Structure

```
admin/
├── Admin.tsx              # Main admin wrapper component
├── AdminLayout.tsx        # Admin layout with sidebar navigation
├── AdminLayout.scss       # Styles for admin layout
├── Dashboard.tsx          # Admin dashboard with statistics
├── Dashboard.scss         # Dashboard styles
├── ManageCourses.tsx      # Course management page
├── ManageCourses.scss     # Course management styles
├── AddCoursePage.tsx      # Add new course page
├── EditCoursePage.tsx     # Edit existing course page
├── CourseForm.scss        # Shared styles for course forms
├── ManageUsers.tsx        # User management page
├── ManageUsers.scss       # User management styles
├── ManageCategories.tsx   # Category management page
├── ManageCategories.scss  # Category management styles
├── Settings.tsx           # Application settings page
└── Settings.scss          # Settings styles
```

## Features

### Dashboard
- **Statistics Overview**: View total courses, active courses, users, and categories
- **Recent Activity**: Track recent changes and updates
- **Quick Actions**: Fast access to common admin tasks

### Course Management
- **View All Courses**: List all courses with search and filter capabilities
- **Add Course**: Create new courses with detailed information
- **Edit Course**: Update existing course details
- **Delete Course**: Remove courses from the system
- **Toggle Status**: Activate or deactivate courses

### User Management
- **View Users**: List all users in the system
- **Search Users**: Find users by name or email
- **User Roles**: View and manage user roles
- **User Status**: Monitor user account status

### Category Management
- **View Categories**: See all course categories
- **Add Category**: Create new categories
- **Edit Category**: Update category details
- **Delete Category**: Remove categories
- **Course Count**: See how many courses are in each category

### Settings
- **General Settings**: Configure site name and email
- **System Settings**: Manage maintenance mode, user registration, and notifications
- **Save Settings**: Persist configuration changes

## Routes

All admin routes are prefixed with `/admin`:

- `/admin` - Dashboard
- `/admin/courses` - Manage Courses
- `/admin/courses/add` - Add New Course
- `/admin/courses/edit/:id` - Edit Course
- `/admin/users` - Manage Users
- `/admin/categories` - Manage Categories
- `/admin/settings` - Settings

## Services

The admin section uses `AdminCourseService` (located in `src/services/AdminCourseService.ts`) for API interactions:

- `getAllCourses()` - Fetch all courses
- `getCourseById(id)` - Get course details
- `addCourse(data)` - Create new course
- `updateCourse(id, data)` - Update course
- `deleteCourse(id)` - Delete course
- `toggleCourseStatus(id, isActive)` - Toggle course status

## Navigation

The admin sidebar provides easy navigation between all admin sections:
- Dashboard
- Manage Courses
- Add Course
- Manage Users
- Categories
- Settings
- Back to Site (returns to main site)

## Styling

All admin components use Bootstrap 5 for base styling with custom SCSS for:
- Responsive layouts
- Card-based designs
- Modern color schemes
- Smooth transitions and hover effects
- Mobile-friendly interfaces

## Usage

To access the admin section:

1. Navigate to `/admin` in your browser
2. The Dashboard will be displayed by default
3. Use the sidebar to navigate between different admin sections
4. Perform CRUD operations on courses, users, and categories
5. Configure application settings as needed

## Development Notes

- All admin components are TypeScript React components
- Forms include validation and error handling
- Loading states are implemented for async operations
- Mock data is used for development when API is unavailable
- Responsive design works on desktop, tablet, and mobile devices

## Future Enhancements

- Authentication/Authorization for admin access
- Role-based permissions
- Bulk operations (bulk delete, bulk update)
- Export data (CSV, Excel)
- Advanced analytics and reporting
- File upload for course materials
- Rich text editor for course descriptions
- Email notifications for admin actions
