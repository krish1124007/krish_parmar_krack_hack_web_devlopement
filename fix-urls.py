# Auto-fix hardcoded URLs to use centralized API config
# This script will update all hardcoded localhost URLs

import os
import re
from pathlib import Path

# Define the replacements
replacements = {
    # Student endpoints
    "http://localhost:8000/api/v1/student/profile": "API_ENDPOINTS.STUDENT.PROFILE",
    "http://localhost:8000/api/v1/student/explore-classes": "API_ENDPOINTS.STUDENT.EXPLORE_CLASSES",
    "http://localhost:8000/api/v1/student/enroll-class": "API_ENDPOINTS.STUDENT.ENROLL_CLASS",
    "'http://localhost:8000/api/v1/student/class/${classId}'": "API_ENDPOINTS.STUDENT.CLASS(classId)",
    "'http://localhost:8000/api/v1/student/class/${selectedClass}/note'": "API_ENDPOINTS.STUDENT.CLASS_NOTE(selectedClass)",
    "http://localhost:8000/api/v1/student/get-domains": "API_ENDPOINTS.STUDENT.GET_DOMAINS",
    "http://localhost:8000/api/v1/problem/student/problems": "API_ENDPOINTS.PROBLEM.STUDENT_PROBLEMS",
    "http://localhost:8000/api/v1/problem/create": "API_ENDPOINTS.PROBLEM.CREATE",
    
    # Faculty endpoints
    "http://localhost:8000/api/v1/faculty/my-classes": "API_ENDPOINTS.FACULTY.MY_CLASSES",
    "'http://localhost:8000/api/v1/faculty/class/${classId}'": "API_ENDPOINTS.FACULTY.CLASS(classId)",
    "'http://localhost:8000/api/v1/faculty/class/${selectedClass}/lecture'": "API_ENDPOINTS.FACULTY.LECTURE(selectedClass)",
    "'http://localhost:8000/api/v1/faculty/class/${selectedClass}/attendance'": "API_ENDPOINTS.FACULTY.ATTENDANCE(selectedClass)",
    "'http://localhost:8000/api/v1/faculty/class/${selectedClass}/grade'": "API_ENDPOINTS.FACULTY.GRADE(selectedClass)",
    "'http://localhost:8000/api/v1/faculty/class/${selectedClass}/note'": "API_ENDPOINTS.FACULTY.NOTE(selectedClass)",
    "'http://localhost:8000/api/v1/faculty/class/${selectedClass}/discussion'": "API_ENDPOINTS.FACULTY.DISCUSSION(selectedClass)",
    "'http://localhost:8000/api/v1/faculty/discussion/${discussionId}/reply'": "API_ENDPOINTS.FACULTY.REPLY(discussionId)",
    
    # Admin endpoints
    "http://localhost:8000/api/v1/admin/get-faculties": "API_ENDPOINTS.ADMIN.GET_FACULTIES",
    "http://localhost:8000/api/v1/admin/get-students": "API_ENDPOINTS.ADMIN.GET_STUDENTS",
    "http://localhost:8000/api/v1/admin/get-authorities": "API_ENDPOINTS.ADMIN.GET_AUTHORITIES",
    "http://localhost:8000/api/v1/admin/get-classes": "API_ENDPOINTS.ADMIN.GET_CLASSES",
    "http://localhost:8000/api/v1/admin/create-student": "API_ENDPOINTS.ADMIN.CREATE_STUDENT",
    "http://localhost:8000/api/v1/admin/bulk-create-students": "API_ENDPOINTS.ADMIN.BULK_CREATE_STUDENTS",
    "'http://localhost:8000/api/v1/admin/delete-student/${id}'": "API_ENDPOINTS.ADMIN.DELETE_STUDENT(id)",
    "http://localhost:8000/api/v1/admin/create-faculty": "API_ENDPOINTS.ADMIN.CREATE_FACULTY",
    "'http://localhost:8000/api/v1/admin/delete-faculty/${id}'": "API_ENDPOINTS.ADMIN.DELETE_FACULTY(id)",
    "http://localhost:8000/api/v1/admin/create-class": "API_ENDPOINTS.ADMIN.CREATE_CLASS",
    "'http://localhost:8000/api/v1/admin/delete-class/${id}'": "API_ENDPOINTS.ADMIN.DELETE_CLASS(id)",
    "http://localhost:8000/api/v1/admin/get-domains": "API_ENDPOINTS.ADMIN.GET_DOMAINS",
    "http://localhost:8000/api/v1/admin/create-domain": "API_ENDPOINTS.ADMIN.CREATE_DOMAIN",
    "http://localhost:8000/api/v1/admin/create-authority": "API_ENDPOINTS.ADMIN.CREATE_AUTHORITY",
    "'http://localhost:8000/api/v1/admin/delete-authority/${id}'": "API_ENDPOINTS.ADMIN.DELETE_AUTHORITY(id)",
    
    # Authority endpoints
    "http://localhost:8000/api/v1/authority/complaints": "API_ENDPOINTS.AUTHORITY.COMPLAINTS",
    "http://localhost:8000/api/v1/authority/colleagues": "API_ENDPOINTS.AUTHORITY.COLLEAGUES",
    "'http://localhost:8000/api/v1/authority/complaints/${id}/accept'": "API_ENDPOINTS.AUTHORITY.ACCEPT_COMPLAINT(id)",
    "'http://localhost:8000/api/v1/authority/complaints/${selectedProblem._id}/status'": "API_ENDPOINTS.AUTHORITY.UPDATE_STATUS(selectedProblem._id)",
    "'http://localhost:8000/api/v1/authority/complaints/${selectedProblem._id}/transfer'": "API_ENDPOINTS.AUTHORITY.TRANSFER_COMPLAINT(selectedProblem._id)",
    "http://localhost:8000/api/v1/authority/stats": "API_ENDPOINTS.AUTHORITY.STATS",
    
    # Problem endpoints
    "http://localhost:8000/api/v1/problem/all": "API_ENDPOINTS.PROBLEM.ALL",
    "'http://localhost:8000/api/v1/problem/update/${id}'": "API_ENDPOINTS.PROBLEM.UPDATE(id)",
}

def process_directory(directory):
    """Process all JS/JSX files in directory"""
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.js', '.jsx')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    original_content = content
                    modified = False
                    
                    # Apply replacements
                    for old, new in replacements.items():
                        if old in content:
                            # Replace quoted strings
                            content = content.replace(f"'{old}'", new)
                            content = content.replace(f'"{old}"', new)
                            content = content.replace(f'`{old}`', new)
                            modified = True
                    
                    # Check if API_ENDPOINTS import is needed and not present
                    if modified and 'API_ENDPOINTS' in content and'from \'../../config/api.config\'' not in content and 'from \'../config/api.config\'' not in content:
                        # Add import at top
                        import_line = "import { API_ENDPOINTS } from '../../config/api.config';\n"
                        content = import_line + content
                    
                    if content != original_content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"Updated: {filepath}")
                
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")

# Main execution
if __name__ == "__main__":
    src_dir = r"c:\Users\Krish\Desktop\krackhack\frontend\aegis\src"
    print("Starting URL replacement...")
    process_directory(src_dir)
    print("Done!")
