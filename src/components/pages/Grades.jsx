import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import GradePill from "@/components/molecules/GradePill";
import GradeEntryForm from "@/components/organisms/GradeEntryForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Input from "@/components/atoms/Input";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import studentService from "@/services/api/studentService";
import assignmentService from "@/services/api/assignmentService";
import gradeService from "@/services/api/gradeService";

const Grades = () => {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [gradeInputs, setGradeInputs] = useState({});

  const loadGradesData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [studentsData, assignmentsData, gradesData] = await Promise.all([
        studentService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll()
      ]);
      
      setStudents(studentsData.filter(s => s.status === "Active"));
      setAssignments(assignmentsData);
      setGrades(gradesData);
    } catch (err) {
      console.error("Error loading grades data:", err);
      setError("Failed to load grades data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGradesData();
  }, []);

  const getGradeForStudent = (studentId, assignmentId) => {
    return grades.find(g => g.studentId === studentId && g.assignmentId === assignmentId);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleGradeChange = (studentId, assignmentId, score) => {
    const key = `${studentId}-${assignmentId}`;
    setGradeInputs(prev => ({
      ...prev,
      [key]: score
    }));
  };

  const handleGradeSubmit = async (studentId, assignmentId) => {
    const key = `${studentId}-${assignmentId}`;
    const score = gradeInputs[key];
    
    if (score === "" || score === null || score === undefined) {
      return;
    }

    const numericScore = parseFloat(score);
    const assignment = assignments.find(a => a.Id === assignmentId);
    
    if (isNaN(numericScore) || numericScore < 0 || numericScore > assignment.totalPoints) {
      toast.error(`Score must be between 0 and ${assignment.totalPoints}`);
      return;
    }

    try {
      const existingGrade = getGradeForStudent(studentId, assignmentId);
      
      if (existingGrade) {
        await gradeService.update(existingGrade.Id, {
          ...existingGrade,
          score: numericScore,
          submittedDate: new Date().toISOString().split("T")[0]
        });
      } else {
        await gradeService.create({
          studentId: studentId,
          assignmentId: assignmentId,
          score: numericScore,
          submittedDate: new Date().toISOString().split("T")[0],
          comments: ""
        });
      }

      // Clear the input
      setGradeInputs(prev => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });

      await loadGradesData();
      toast.success("Grade saved successfully!");
    } catch (error) {
      console.error("Error saving grade:", error);
      toast.error("Failed to save grade");
    }
  };

  const calculateStudentAverage = (studentId) => {
    const studentGrades = grades.filter(g => g.studentId === studentId && g.score !== null);
    if (studentGrades.length === 0) return null;

    let totalPoints = 0;
    let earnedPoints = 0;

    studentGrades.forEach(grade => {
      const assignment = assignments.find(a => a.Id === grade.assignmentId);
      if (assignment) {
        totalPoints += assignment.totalPoints;
        earnedPoints += grade.score;
      }
    });

    return totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
        </div>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
        </div>
        <Error
          title="Failed to Load Grades"
          message={error}
          onRetry={loadGradesData}
        />
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
        </div>
        <Empty
          title="No active students"
          message="You need to have active students to manage grades. Add some students first."
          icon="BookOpen"
          actionLabel="Go to Students"
          onAction={() => window.location.href = "/students"}
        />
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
        </div>
        <Empty
          title="No assignments yet"
          message="Create your first assignment to start tracking grades."
          icon="BookOpen"
          actionLabel="Create Assignment"
          onAction={() => setIsFormOpen(true)}
        />
        <GradeEntryForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onAssignmentAdded={loadGradesData}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
          <p className="text-secondary-600">
            Manage assignments and track student progress
          </p>
        </div>
        <Button
          variant="accent"
          icon="Plus"
          onClick={() => setIsFormOpen(true)}
        >
          Add Assignment
        </Button>
      </div>

      {/* Assignments Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Assignments</p>
                <p className="text-2xl font-bold text-blue-800">{assignments.length}</p>
              </div>
              <ApperIcon name="BookOpen" className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Grades Entered</p>
                <p className="text-2xl font-bold text-green-800">
                  {grades.filter(g => g.score !== null).length}
                </p>
              </div>
              <ApperIcon name="CheckCircle" className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">Class Average</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {(() => {
                    const validGrades = grades.filter(g => g.score !== null);
                    if (validGrades.length === 0) return "—";
                    
                    let totalPoints = 0;
                    let earnedPoints = 0;
                    
                    validGrades.forEach(grade => {
                      const assignment = assignments.find(a => a.Id === grade.assignmentId);
                      if (assignment) {
                        totalPoints += assignment.totalPoints;
                        earnedPoints += grade.score;
                      }
                    });
                    
                    return totalPoints > 0 ? `${Math.round((earnedPoints / totalPoints) * 100)}%` : "—";
                  })()}
                </p>
              </div>
              <ApperIcon name="TrendingUp" className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Gradebook */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Gradebook</h3>
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200" 
                 style={{ gridTemplateColumns: `200px repeat(${assignments.length}, 120px) 100px` }}>
              <div className="font-semibold text-secondary-700">Student</div>
              {assignments.map(assignment => (
                <div key={assignment.Id} className="text-center">
                  <div className="font-medium text-secondary-700 text-sm truncate" title={assignment.title}>
                    {assignment.title}
                  </div>
                  <div className="text-xs text-secondary-500 mt-1">
                    {assignment.totalPoints} pts
                  </div>
                  <div className="text-xs text-secondary-500">
                    Due: {formatDate(assignment.dueDate)}
                  </div>
                </div>
              ))}
              <div className="text-center font-semibold text-secondary-700">Average</div>
            </div>

            {/* Student Rows */}
            <div className="divide-y divide-gray-200">
              {students.map(student => (
                <div key={student.Id} 
                     className="grid gap-4 p-4 hover:bg-gray-50 transition-colors duration-200 items-center"
                     style={{ gridTemplateColumns: `200px repeat(${assignments.length}, 120px) 100px` }}>
                  <div className="flex items-center space-x-3">
                    <Avatar
                      initials={getInitials(student.firstName, student.lastName)}
                      size="sm"
                    />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-xs text-secondary-500">
                        Grade {student.gradeLevel}
                      </div>
                    </div>
                  </div>

                  {assignments.map(assignment => {
                    const existingGrade = getGradeForStudent(student.Id, assignment.Id);
                    const inputKey = `${student.Id}-${assignment.Id}`;
                    const inputValue = gradeInputs[inputKey];
                    
                    return (
                      <div key={assignment.Id} className="flex flex-col items-center space-y-2">
                        {existingGrade && existingGrade.score !== null ? (
                          <div className="text-center">
                            <GradePill 
                              score={existingGrade.score} 
                              totalPoints={assignment.totalPoints} 
                            />
                            <div className="text-xs text-secondary-500 mt-1">
                              {existingGrade.score}/{assignment.totalPoints}
                            </div>
                          </div>
                        ) : (
                          <div className="w-full">
                            <Input
                              type="number"
                              min="0"
                              max={assignment.totalPoints}
                              step="0.5"
                              value={inputValue || ""}
                              onChange={(e) => handleGradeChange(student.Id, assignment.Id, e.target.value)}
                              onBlur={() => {
                                if (inputValue !== "" && inputValue !== null && inputValue !== undefined) {
                                  handleGradeSubmit(student.Id, assignment.Id);
                                }
                              }}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  handleGradeSubmit(student.Id, assignment.Id);
                                }
                              }}
                              placeholder={`0-${assignment.totalPoints}`}
                              className="text-center text-sm"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="text-center">
                    {(() => {
                      const average = calculateStudentAverage(student.Id);
                      return average !== null ? (
                        <div className="font-semibold text-lg text-gray-900">
                          {average}%
                        </div>
                      ) : (
                        <div className="text-secondary-400 text-sm">—</div>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Grade Entry Form */}
      <GradeEntryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onAssignmentAdded={loadGradesData}
      />
    </div>
  );
};

export default Grades;