import { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import studentService from "@/services/api/studentService";

const StudentModal = ({ isOpen, onClose, onStudentAdded }) => {
const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    email_c: "",
    phone_c: "",
    date_of_birth_c: "",
    grade_level_c: "",
    status_c: "Active"
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
const studentData = {
        ...formData,
        enrollment_date_c: new Date().toISOString().split("T")[0]
      };

      await studentService.create(studentData);
      toast.success("Student added successfully!");
      onStudentAdded?.();
      handleClose();
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Failed to add student");
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
              Add New Student
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
                label="Status"
                value={formData.status_c}
                onChange={(e) => handleInputChange("status_c", e.target.value)}
                options={statusOptions}
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
                Add Student
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;