/* ==========================================
   Dashboard Script - Courses & Course Management
   ========================================== */

let currentUser = null;
let currentCourseModal = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Verify authentication
    const auth = await ensureAuthenticated();
    if (!auth) return;

    currentUser = auth;

    // Initialize UI
    initializeUI();
    setupMenuItems();
    setupEventListeners();
    
    // Load initial data
    await loadDashboard();
});

// ==========================================
// Initialize UI
// ==========================================

function initializeUI() {
    // Update user info
    document.getElementById('userName').textContent = currentUser.username;
    document.getElementById('userRole').textContent = currentUser.role === 'faculty' ? 'Faculty' : 'Student';

    // Show/hide role-specific menus
    const requestsMenu = document.getElementById('requestsMenu');
    const createCourseMenu = document.getElementById('createCourseMenu');
    const facultyCreateForm = document.getElementById('facultyCreateForm');

    if (currentUser.role === 'faculty') {
        requestsMenu.style.display = 'flex';
        createCourseMenu.style.display = 'flex';
        facultyCreateForm.style.display = 'block';
    }

    // Update profile
    document.getElementById('profileUsername').textContent = currentUser.username;
    document.getElementById('profileRole').textContent = currentUser.role === 'faculty' ? 'Faculty' : 'Student';
    document.getElementById('profileUserId').textContent = currentUser.user_id;
}

// ==========================================
// Setup Menu Navigation
// ==========================================

function setupMenuItems() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const viewName = item.dataset.view;
            if (!viewName) return;

            // Remove active class from all menu items
            menuItems.forEach(m => m.classList.remove('active'));
            item.classList.add('active');

            // Hide all views
            const views = document.querySelectorAll('.view');
            views.forEach(view => view.classList.remove('active'));

            // Show selected view
            const viewElement = document.getElementById(`view-${viewName}`);
            if (viewElement) {
                viewElement.classList.add('active');

                // Load view-specific data
                if (viewName === 'courses') {
                    loadCourses();
                } else if (viewName === 'requests') {
                    loadRequests();
                }
            }
        });
    });
}

// ==========================================
// Setup Event Listeners
// ==========================================

function setupEventListeners() {
    // Create course forms
    const createCourseForm = document.getElementById('createCourseForm');
    const createCourseForm2 = document.getElementById('createCourseForm2');

    if (createCourseForm) {
        createCourseForm.addEventListener('submit', handleCreateCourse);
    }
    if (createCourseForm2) {
        createCourseForm2.addEventListener('submit', handleCreateCourse);
    }
}

// ==========================================
// Load Dashboard
// ==========================================

async function loadDashboard() {
    try {
        const courses = await apiCall('get_courses.php', 'GET');
        
        // Update stats
        document.getElementById('coursesCount').textContent = Array.isArray(courses) ? courses.length : 0;
        
        if (currentUser.role === 'student') {
            document.getElementById('dashboardStudentInfo').style.display = 'block';
            const enrolledCourses = courses.filter(c => c.request_status === 'approved');
            document.getElementById('dashboardCourses').innerHTML = enrolledCourses.length > 0
                ? enrolledCourses.map(course => createCourseCardHTML(course)).join('')
                : '<p class="empty-state">No enrolled courses yet.</p>';
        } else {
            document.getElementById('dashboardFacultyInfo').style.display = 'block';
            document.getElementById('dashboardFacultyCourses').innerHTML = courses.length > 0
                ? courses.map(course => createCourseCardHTML(course)).join('')
                : '<p class="empty-state">You haven\'t created any courses yet.</p>';
        }

    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// ==========================================
// Load Courses
// ==========================================

async function loadCourses() {
    try {
        const courses = await apiCall('get_courses.php', 'GET');
        const coursesList = document.getElementById('coursesList');

        if (!Array.isArray(courses) || courses.length === 0) {
            coursesList.innerHTML = '<p class="empty-state">No courses available.</p>';
            return;
        }

        coursesList.innerHTML = courses.map(course => createCourseCardHTML(course)).join('');

        // Add event listeners to course cards
        const courseCards = coursesList.querySelectorAll('.course-card');
        courseCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.course-actions')) return;
                const courseId = card.dataset.courseId;
                showCourseModal(courses.find(c => c.id == courseId));
            });

            // Button event listeners
            const requestBtn = card.querySelector('.btn-request');
            if (requestBtn) {
                requestBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const courseId = card.dataset.courseId;
                    await requestJoinCourse(courseId, requestBtn);
                });
            }

            const viewRequestsBtn = card.querySelector('.btn-view-requests');
            if (viewRequestsBtn) {
                viewRequestsBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    const courseId = card.dataset.courseId;
                    await loadCourseRequests(courseId);
                });
            }
        });

    } catch (error) {
        console.error('Error loading courses:', error);
        document.getElementById('coursesList').innerHTML = '<p class="empty-state">Error loading courses.</p>';
    }
}

// ==========================================
// Load Course Requests (Faculty)
// ==========================================

async function loadCourseRequests(courseId) {
    try {
        const requests = await apiCall(`get_course_requests.php?course_id=${courseId}`, 'GET');
        
        let html = '';
        if (Array.isArray(requests) && requests.length > 0) {
            html = requests.map(req => `
                <div class="request-item">
                    <div class="request-info">
                        <h4>${req.student_username}</h4>
                        <p>Status: <span class="request-status ${req.status}">${req.status}</span></p>
                    </div>
                    <div class="request-actions">
                        ${req.status === 'pending' ? `
                            <button class="btn btn-success" onclick="approveRequest(${req.request_id})">Approve</button>
                            <button class="btn btn-danger" onclick="rejectRequest(${req.request_id})">Reject</button>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        } else {
            html = '<p class="empty-state">No requests.</p>';
        }

        document.getElementById('modalRequestsList').innerHTML = html;
        openModal('requestsModal');

    } catch (error) {
        console.error('Error loading course requests:', error);
    }
}

// ==========================================
// Approve/Reject Request
// ==========================================

async function approveRequest(requestId) {
    if (!confirm('Approve this request?')) return;

    try {
        const response = await apiCall('manage_request.php', 'POST', {
            request_id: requestId,
            action: 'approve'
        });

        if (response.success) {
            alert('Request approved!');
            // Reload the requests
            const courseId = document.querySelector('[data-course-id]')?.dataset.courseId;
            if (courseId) {
                await loadCourseRequests(courseId);
            }
        } else {
            alert('Failed to approve request');
        }
    } catch (error) {
        console.error('Error approving request:', error);
    }
}

async function rejectRequest(requestId) {
    if (!confirm('Reject this request?')) return;

    try {
        const response = await apiCall('manage_request.php', 'POST', {
            request_id: requestId,
            action: 'reject'
        });

        if (response.success) {
            alert('Request rejected!');
            // Reload the requests
            const courseId = document.querySelector('[data-course-id]')?.dataset.courseId;
            if (courseId) {
                await loadCourseRequests(courseId);
            }
        } else {
            alert('Failed to reject request');
        }
    } catch (error) {
        console.error('Error rejecting request:', error);
    }
}

// ==========================================
// Request Join Course
// ==========================================

async function requestJoinCourse(courseId, button) {
    if (!confirm('Request to join this course?')) return;

    try {
        button.disabled = true;
        button.textContent = 'Requesting...';

        const response = await apiCall('request_join.php', 'POST', {
            course_id: courseId
        });

        if (response.success) {
            alert('Request sent!');
            button.textContent = 'Request Pending';
            button.disabled = true;
            await loadCourses();
        } else {
            alert(response.message || 'Failed to request course');
            button.disabled = false;
            button.textContent = 'Request to Join';
        }
    } catch (error) {
        console.error('Error requesting course:', error);
        button.disabled = false;
        button.textContent = 'Request to Join';
    }
}

// ==========================================
// Load Requests (Faculty)
// ==========================================

async function loadRequests() {
    try {
        const courses = await apiCall('get_courses.php', 'GET');
        const requestsList = document.getElementById('requestsList');

        let allRequests = [];

        for (const course of courses) {
            const requests = await apiCall(`get_course_requests.php?course_id=${course.id}`, 'GET');
            if (Array.isArray(requests)) {
                allRequests = allRequests.concat(requests.map(r => ({...r, course_title: course.title})));
            }
        }

        if (allRequests.length === 0) {
            requestsList.innerHTML = '<p class="empty-state">No pending requests.</p>';
            return;
        }

        const pendingRequests = allRequests.filter(r => r.status === 'pending');
        
        requestsList.innerHTML = pendingRequests.length > 0
            ? pendingRequests.map(req => `
                <div class="request-item">
                    <div class="request-info">
                        <h4>${req.student_username}</h4>
                        <p>Course: ${req.course_title}</p>
                        <p>Status: <span class="request-status ${req.status}">${req.status}</span></p>
                    </div>
                    <div class="request-actions">
                        <button class="btn btn-success" onclick="approveRequest(${req.request_id})">Approve</button>
                        <button class="btn btn-danger" onclick="rejectRequest(${req.request_id})">Reject</button>
                    </div>
                </div>
            `).join('')
            : '<p class="empty-state">No pending requests.</p>';

    } catch (error) {
        console.error('Error loading requests:', error);
        document.getElementById('requestsList').innerHTML = '<p class="empty-state">Error loading requests.</p>';
    }
}

// ==========================================
// Create Course Handler
// ==========================================

async function handleCreateCourse(e) {
    e.preventDefault();

    const form = e.target;
    const formNum = form.id.includes('2') ? '2' : '';
    
    const code = document.getElementById(`courseCode${formNum}`).value.trim();
    const title = document.getElementById(`courseTitle${formNum}`).value.trim();
    const messageElement = document.getElementById(`createCourseMessage${formNum}`);

    if (!code || !title) {
        showMessage(`createCourseMessage${formNum}`, 'Please fill in all fields', 'error');
        return;
    }

    try {
        const response = await apiCall('create_course.php', 'POST', {
            code,
            title
        });

        if (response.success) {
            showMessage(`createCourseMessage${formNum}`, 'Course created successfully!', 'success');
            form.reset();
            setTimeout(() => {
                loadDashboard();
                loadCourses();
            }, 1000);
        } else {
            showMessage(`createCourseMessage${formNum}`, response.message || 'Failed to create course', 'error');
        }
    } catch (error) {
        console.error('Error creating course:', error);
        showMessage(`createCourseMessage${formNum}`, 'An error occurred', 'error');
    }
}

// ==========================================
// Show Course Modal
// ==========================================

function showCourseModal(course) {
    currentCourseModal = course;

    document.getElementById('modalCourseCode').textContent = course.code;
    document.getElementById('modalCourseTitle2').textContent = course.title;
    document.getElementById('modalCourseFaculty').textContent = course.faculty_id || 'Unknown';

    // Determine status and action buttons
    const requestJoinBtn = document.getElementById('requestJoinBtn');
    const viewRequestsBtn = document.getElementById('viewRequestsBtn');

    requestJoinBtn.style.display = 'none';
    viewRequestsBtn.style.display = 'none';

    if (currentUser.role === 'student') {
        if (course.request_status === 'approved') {
            document.getElementById('modalCourseStatus').textContent = 'Enrolled';
        } else if (course.request_status === 'pending') {
            document.getElementById('modalCourseStatus').textContent = 'Request Pending';
        } else {
            document.getElementById('modalCourseStatus').textContent = 'Available';
            requestJoinBtn.style.display = 'inline-block';
            requestJoinBtn.onclick = () => {
                closeModal('courseModal');
                requestJoinCourse(course.id, requestJoinBtn);
            };
        }
    } else {
        document.getElementById('modalCourseStatus').textContent = 'Your Course';
        viewRequestsBtn.style.display = 'inline-block';
        viewRequestsBtn.onclick = () => {
            closeModal('courseModal');
            loadCourseRequests(course.id);
        };
    }

    openModal('courseModal');
}

// ==========================================
// Create Course Card HTML
// ==========================================

function createCourseCardHTML(course) {
    let statusClass = 'available';
    let statusText = 'Available';
    let actionButton = '';

    if (currentUser.role === 'student') {
        if (course.request_status === 'approved') {
            statusClass = 'enrolled';
            statusText = 'Enrolled';
        } else if (course.request_status === 'pending') {
            statusClass = 'pending';
            statusText = 'Pending';
            actionButton = '<button class="btn btn-secondary btn-request" disabled>Request Pending</button>';
        } else {
            actionButton = '<button class="btn btn-primary btn-request">Request to Join</button>';
        }
    } else {
        statusText = 'Your Course';
        statusClass = 'enrolled';
        actionButton = '<button class="btn btn-secondary btn-view-requests">View Requests</button>';
    }

    return `
        <div class="course-card" data-course-id="${course.id}">
            <div class="course-header">
                <span class="course-code">${course.code}</span>
                <span class="course-status ${statusClass}">${statusText}</span>
            </div>
            <h3 class="course-title">${course.title}</h3>
            <p class="course-faculty">Faculty: ${course.faculty_id || 'Unknown'}</p>
            <div class="course-actions">
                ${actionButton}
            </div>
        </div>
    `;
}
