import { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import Card from "@/components/atoms/Card";
import studentService from "@/services/api/studentService";

const StudentTable = ({ students = [], onStudentUpdated, onStudentDeleted, onStudentEdit }) => {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (studentId, newStatus) => {
    setLoading(true);
    try {
      const student = students.find(s => s.Id === studentId);
      if (student) {
        await studentService.update(studentId, { ...student, status: newStatus });
        onStudentUpdated?.();
        toast.success("Student status updated successfully!");
      }
    } catch (error) {
      console.error("Error updating student status:", error);
      toast.error("Failed to update student status");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    setLoading(true);
    try {
      await studentService.delete(studentId);
      onStudentDeleted?.();
      toast.success("Student deleted successfully!");
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Failed to delete student");
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active": return "success";
      case "inactive": return "error";
      case "on hold": return "warning";
      default: return "default";
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-secondary-700">Student</th>
              <th className="text-left py-3 px-4 font-semibold text-secondary-700">Contact</th>
              <th className="text-left py-3 px-4 font-semibold text-secondary-700">Grade Level</th>
              <th className="text-left py-3 px-4 font-semibold text-secondary-700">Age</th>
              <th className="text-left py-3 px-4 font-semibold text-secondary-700">Enrolled</th>
              <th className="text-left py-3 px-4 font-semibold text-secondary-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-secondary-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {students.map((student) => (
              <tr 
                key={student.Id} 
                className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200"
              >
<td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <Avatar 
                      initials={getInitials(student.first_name_c, student.last_name_c)}
                      size="md"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {student.first_name_c} {student.last_name_c}
                      </div>
                      <div className="text-sm text-secondary-500">
                        ID: {student.Id}
                      </div>
                    </div>
                  </div>
                </td>
<td className="py-4 px-4">
                  <div className="text-sm">
                    <div className="text-gray-900">{student.email_c || 'No email'}</div>
                    <div className="text-secondary-500">{student.phone_c || 'No phone'}</div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <Badge variant="grade">
                    {student.grade_level_c}
                  </Badge>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {calculateAge(student.date_of_birth_c)} years
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {formatDate(student.enrollment_date_c)}
                </td>
                <td className="py-4 px-4">
<select
                    value={student.status_c}
                    onChange={(e) => handleStatusChange(student.Id, e.target.value)}
                    disabled={loading}
                    className="text-sm border-0 bg-transparent focus:ring-0 p-0"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
icon="Edit"
                      onClick={() => {
                        onStudentEdit?.(student);
                      }}
                      disabled={loading}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Trash2"
                      onClick={() => handleDelete(student.Id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default StudentTable;