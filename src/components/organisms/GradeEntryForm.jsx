import { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import assignmentService from "@/services/api/assignmentService";

const GradeEntryForm = ({ isOpen, onClose, onAssignmentAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    totalPoints: "",
    dueDate: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categoryOptions = [
    { value: "Homework", label: "Homework" },
    { value: "Quiz", label: "Quiz" },
    { value: "Test", label: "Test" },
    { value: "Project", label: "Project" },
    { value: "Participation", label: "Participation" },
    { value: "Extra Credit", label: "Extra Credit" }
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

    if (!formData.title.trim()) {
      newErrors.title = "Assignment title is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.totalPoints || formData.totalPoints <= 0) {
      newErrors.totalPoints = "Total points must be greater than 0";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
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
      const assignmentData = {
        ...formData,
        totalPoints: parseInt(formData.totalPoints)
      };

      await assignmentService.create(assignmentData);
      toast.success("Assignment created successfully!");
      onAssignmentAdded?.();
      handleClose();
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error("Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      category: "",
      totalPoints: "",
      dueDate: "",
      description: ""
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
              Create New Assignment
            </h3>
            <Button
              variant="ghost"
              size="sm"
              icon="X"
              onClick={handleClose}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Assignment Title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              error={errors.title}
              placeholder="Enter assignment title"
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                options={categoryOptions}
                error={errors.category}
                placeholder="Select category"
              />
              <Input
                label="Total Points"
                type="number"
                min="1"
                value={formData.totalPoints}
                onChange={(e) => handleInputChange("totalPoints", e.target.value)}
                error={errors.totalPoints}
                placeholder="Enter total points"
              />
            </div>

            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
              error={errors.dueDate}
            />

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-white border border-secondary-300 rounded-lg text-secondary-900 placeholder:text-secondary-400 focus:ring-2 focus:ring-accent-500 focus:border-accent-500 focus:outline-none transition-colors duration-200"
                placeholder="Enter assignment description..."
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
                Create Assignment
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GradeEntryForm;