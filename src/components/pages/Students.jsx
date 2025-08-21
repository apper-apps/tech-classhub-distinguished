import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import StudentTable from "@/components/organisms/StudentTable";
import StudentModal from "@/components/organisms/StudentModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import studentService from "@/services/api/studentService";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const loadStudents = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      console.error("Error loading students:", err);
      setError("Failed to load students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredStudents(students);
} else {
      const filtered = students.filter(student => 
        student.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.phone?.includes(searchQuery) ||
        student.gradeLevel?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        </div>
        <Loading type="student-cards" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        </div>
        <Error
          title="Failed to Load Students"
          message={error}
          onRetry={loadStudents}
        />
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        </div>
        <Empty
          title="No students yet"
          message="Start building your class roster by adding your first student."
          icon="Users"
          actionLabel="Add First Student"
          onAction={() => setIsModalOpen(true)}
        />
        <StudentModal
isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingStudent(null);
          }}
          onStudentAdded={loadStudents}
          student={editingStudent}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-secondary-600">
            Manage your class roster and student information
          </p>
        </div>
        <Button
          variant="accent"
          icon="UserPlus"
          onClick={() => setIsModalOpen(true)}
        >
          Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 max-w-md">
          <SearchBar
            placeholder="Search students by name, email, phone, or grade..."
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
          />
        </div>
        <div className="text-sm text-secondary-600">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <Empty
          title="No students found"
          message={searchQuery ? `No students match "${searchQuery}"` : "No students to display"}
          icon="Search"
        />
      ) : (
        <StudentTable
students={filteredStudents}
          onStudentUpdated={loadStudents}
          onStudentDeleted={loadStudents}
          onStudentEdit={(student) => {
            setEditingStudent(student);
            setIsModalOpen(true);
          }}
        />
      )}

      {/* Add Student Modal */}
<StudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
        }}
        onStudentAdded={loadStudents}
        student={editingStudent}
      />
    </div>
  );
};

export default Students;