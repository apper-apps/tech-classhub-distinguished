import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import studentService from "@/services/api/studentService";
import assignmentService from "@/services/api/assignmentService";
import gradeService from "@/services/api/gradeService";

const GradeCreateForm = ({ isOpen, onClose, onGradeAdded }) => {
  const [formData, setFormData] = useState({
    student_id_c: "",
    assignment_id_c: "",
    score_c: "",
    comments_c: "",
    submitted_date_c: new Date().toISOString().split("T")[0]
  });
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Load students and assignments when form opens
  useEffect(() => {
    if (isOpen) {
      loadFormData();
    }
  }, [isOpen]);

  const loadFormData = async () => {
    setDataLoading(true);
    try {
      const [studentsData, assignmentsData] = await Promise.all([
        studentService.getAll(),
        assignmentService.getAll()
      ]);
      
      setStudents(studentsData.filter(s => s.status_c === "Active"));
      setAssignments(assignmentsData);
    } catch (error) {
      console.error("Error loading form data:", error);
      toast.error("Failed to load students and assignments");
    } finally {
      setDataLoading(false);
    }
  };

  const studentOptions = students.map(student => ({
    value: student.Id.toString(),
    label: `${student.first_name_c} ${student.last_name_c} - Grade ${student.grade_level_c}`
  }));

  const assignmentOptions = assignments.map(assignment => ({
    value: assignment.Id.toString(),
    label: `${assignment.title_c} (${assignment.total_points_c} pts) - ${assignment.category_c}`
  }));

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.student_id_c) {
      newErrors.student_id_c = "Student is required";
    }

    if (!formData.assignment_id_c) {
      newErrors.assignment_id_c = "Assignment is required";
    }

    if (!formData.score_c && formData.score_c !== 0) {
      newErrors.score_c = "Score is required";
    } else {
      const score = parseFloat(formData.score_c);
      if (isNaN(score) || score < 0) {
        newErrors.score_c = "Score must be a valid number greater than or equal to 0";
      } else if (formData.assignment_id_c) {
        const assignment = assignments.find(a => a.Id.toString() === formData.assignment_id_c);
        if (assignment && score > assignment.total_points_c) {
          newErrors.score_c = `Score cannot exceed ${assignment.total_points_c} points`;
        }
      }
    }

    if (!formData.submitted_date_c) {
      newErrors.submitted_date_c = "Submitted date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Prepare grade data with only updateable fields
      const gradeData = {
        student_id_c: parseInt(formData.student_id_c),
        assignment_id_c: parseInt(formData.assignment_id_c),
        score_c: parseFloat(formData.score_c),
        submitted_date_c: formData.submitted_date_c,
        comments_c: formData.comments_c || ""
      };

      await gradeService.create(gradeData);
      toast.success("Grade created successfully!");
      onGradeAdded?.();
      handleClose();
    } catch (error) {
      console.error("Error creating grade:", error);
      toast.error("Failed to create grade");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      student_id_c: "",
      assignment_id_c: "",
      score_c: "",
      comments_c: "",
      submitted_date_c: new Date().toISOString().split("T")[0]
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm" onClick={handleClose}></div>

        <div className="inline-block w-full max-w-lg p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Create New Grade
            </h3>
            <Button
              variant="ghost"
              size="sm"
              icon="X"
              onClick={handleClose}
            />
          </div>

          {dataLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Student"
                value={formData.student_id_c}
                onChange={(e) => handleInputChange("student_id_c", e.target.value)}
                options={studentOptions}
                error={errors.student_id_c}
                placeholder="Select a student"
              />

              <Select
                label="Assignment"
                value={formData.assignment_id_c}
                onChange={(e) => handleInputChange("assignment_id_c", e.target.value)}
                options={assignmentOptions}
                error={errors.assignment_id_c}
                placeholder="Select an assignment"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Score"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.score_c}
                  onChange={(e) => handleInputChange("score_c", e.target.value)}
                  error={errors.score_c}
                  placeholder="Enter score"
                  helper={
                    formData.assignment_id_c 
                      ? `Max: ${assignments.find(a => a.Id.toString() === formData.assignment_id_c)?.total_points_c || 0} points`
                      : "Select assignment to see max points"
                  }
                />
                <Input
                  label="Submitted Date"
                  type="date"
                  value={formData.submitted_date_c}
                  onChange={(e) => handleInputChange("submitted_date_c", e.target.value)}
                  error={errors.submitted_date_c}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Comments (Optional)
                </label>
                <textarea
                  value={formData.comments_c}
                  onChange={(e) => handleInputChange("comments_c", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-secondary-300 rounded-lg text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 focus:outline-none transition-colors duration-200"
                  placeholder="Enter any comments about this grade..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="accent"
                  loading={loading}
                  icon="Plus"
                >
                  Create Grade
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradeCreateForm;