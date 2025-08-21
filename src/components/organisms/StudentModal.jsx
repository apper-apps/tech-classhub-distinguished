import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import studentService from "@/services/api/studentService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

const StudentModal = ({ isOpen, onClose, onStudentAdded, student }) => {
const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    email_c: "",
    phone_c: "",
    date_of_birth_c: "",
    grade_level_c: "",
    academic_year_c: "",
    marks_c: "",
    status_c: "Active"
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const isEditing = !!student;

  // Populate form when editing
useEffect(() => {
    if (student) {
      setFormData({
        first_name_c: student.firstName || "",
        last_name_c: student.lastName || "",
        email_c: student.email || "",
        phone_c: student.phone || "",
        date_of_birth_c: student.dateOfBirth || "",
        grade_level_c: student.gradeLevel || "",
        academic_year_c: student.academicYear || "",
        marks_c: student.marks || "",
        status_c: student.status || "Active"
      });
    } else {
// Reset form for adding new student
      setFormData({
        first_name_c: "",
        last_name_c: "",
        email_c: "",
        phone_c: "",
        date_of_birth_c: "",
        grade_level_c: "",
        academic_year_c: "",
        marks_c: "",
        status_c: "Active"
      });
    }
    setErrors({});
  }, [student]);
const gradeOptions = [
    { value: "K", label: "Kindergarten" },
    { value: "1", label: "1st Grade" },
    { value: "2", label: "2nd Grade" },
    { value: "3", label: "3rd Grade" },
    { value: "4", label: "4th Grade" },
    { value: "5", label: "5th Grade" },
    { value: "6", label: "6th Grade" },
    { value: "7", label: "7th Grade" },
    { value: "8", label: "8th Grade" },
    { value: "9", label: "9th Grade" },
    { value: "10", label: "10th Grade" },
    { value: "11", label: "11th Grade" },
    { value: "12", label: "12th Grade" }
  ];

  const academicYearOptions = [
    { value: "Freshman", label: "Freshman" },
    { value: "Sophomore", label: "Sophomore" },
    { value: "Junior", label: "Junior" },
    { value: "Senior", label: "Senior" },
    { value: "Graduate", label: "Graduate" }
  ];

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "On Hold", label: "On Hold" }
  ];

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

if (!formData.first_name_c.trim()) {
      newErrors.first_name_c = "First name is required";
    }

    if (!formData.last_name_c.trim()) {
      newErrors.last_name_c = "Last name is required";
    }

    if (!formData.email_c.trim()) {
      newErrors.email_c = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email_c)) {
      newErrors.email_c = "Email is invalid";
    }

    if (!formData.phone_c.trim()) {
      newErrors.phone_c = "Phone number is required";
    }

    if (!formData.date_of_birth_c) {
      newErrors.date_of_birth_c = "Date of birth is required";
    }

    if (!formData.grade_level_c) {
      newErrors.grade_level_c = "Grade level is required";
    }

    if (!formData.academic_year_c) {
      newErrors.academic_year_c = "Academic year is required";
    }

    if (formData.marks_c && (isNaN(formData.marks_c) || formData.marks_c < 0 || formData.marks_c > 100)) {
      newErrors.marks_c = "Marks must be a number between 0 and 100";
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
      // Convert marks to integer to match database field type
      const processedData = {
        ...formData,
        marks_c: formData.marks_c ? parseInt(formData.marks_c, 10) : null
      };

      if (isEditing) {
        // Update existing student
        await studentService.update(student.Id, processedData);
        toast.success("Student updated successfully!");
      } else {
        // Create new student
        const studentData = {
          ...processedData,
          enrollment_date_c: new Date().toISOString().split("T")[0]
        };
        await studentService.create(studentData);
        toast.success("Student added successfully!");
      }
      
      onStudentAdded?.();
      handleClose();
    } catch (error) {
      console.error(isEditing ? "Error updating student:" : "Error adding student:", error);
      toast.error(isEditing ? "Failed to update student" : "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

const handleClose = () => {
setFormData({
      first_name_c: "",
      last_name_c: "",
      email_c: "",
      phone_c: "",
      date_of_birth_c: "",
      grade_level_c: "",
      academic_year_c: "",
      marks_c: "",
      status_c: "Active"
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm" onClick={handleClose}></div>

        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-6">
<h3 className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Edit Student' : 'Add New Student'}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              icon="X"
              onClick={handleClose}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
<Input
                label="First Name"
                value={formData.first_name_c}
                onChange={(e) => handleInputChange("first_name_c", e.target.value)}
                error={errors.first_name_c}
                placeholder="Enter first name"
              />
<Input
                label="Last Name"
                value={formData.last_name_c}
                onChange={(e) => handleInputChange("last_name_c", e.target.value)}
                error={errors.last_name_c}
                placeholder="Enter last name"
              />
            </div>

<Input
              label="Email"
              type="email"
              value={formData.email_c}
              onChange={(e) => handleInputChange("email_c", e.target.value)}
              error={errors.email_c}
              placeholder="Enter email address"
            />

<Input
              label="Phone"
              type="tel"
              value={formData.phone_c}
              onChange={(e) => handleInputChange("phone_c", e.target.value)}
              error={errors.phone_c}
              placeholder="Enter phone number"
            />

<Input
              label="Date of Birth"
              type="date"
              value={formData.date_of_birth_c}
              onChange={(e) => handleInputChange("date_of_birth_c", e.target.value)}
              error={errors.date_of_birth_c}
            />

            <Input
              label="Marks"
              type="number"
              placeholder="Enter marks (0-100)"
              value={formData.marks_c}
              onChange={(e) => handleInputChange("marks_c", e.target.value)}
              error={errors.marks_c}
              min="0"
              max="100"
            />

<div className="grid grid-cols-2 gap-4">
<Select
                label="Grade Level"
                value={formData.grade_level_c}
                onChange={(e) => handleInputChange("grade_level_c", e.target.value)}
                options={gradeOptions}
                error={errors.grade_level_c}
                placeholder="Select grade"
              />
<Select
                label="Academic Year"
                value={formData.academic_year_c}
                onChange={(e) => handleInputChange("academic_year_c", e.target.value)}
                options={academicYearOptions}
                error={errors.academic_year_c}
                placeholder="Select academic year"
              />
            </div>

            <Select
              label="Status"
              value={formData.status_c}
              onChange={(e) => handleInputChange("status_c", e.target.value)}
              options={statusOptions}
            />

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
                {isEditing ? 'Update Student' : 'Add Student'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;