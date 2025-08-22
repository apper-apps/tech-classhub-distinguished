import { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth } from "date-fns";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import studentService from "@/services/api/studentService";
import attendanceService from "@/services/api/attendanceService";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAttendanceData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [studentsData, attendanceData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll()
      ]);
setStudents(studentsData.filter(s => s.status_c === "Active"));
      setAttendance(attendanceData);
    } catch (err) {
      console.error("Error loading attendance data:", err);
      setError("Failed to load attendance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const handlePreviousMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date());
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        </div>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        </div>
        <Error
          title="Failed to Load Attendance"
          message={error}
          onRetry={loadAttendanceData}
        />
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        </div>
        <Empty
          title="No active students"
          message="You need to have active students to track attendance. Add some students first."
          icon="Calendar"
          actionLabel="Go to Students"
          onAction={() => window.location.href = "/students"}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-secondary-600">
            Track daily attendance for your students
          </p>
        </div>
      </div>

      {/* Date Navigation */}
      <Card>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              icon="ChevronLeft"
              onClick={handlePreviousMonth}
            />
            <h2 className="text-lg font-semibold text-gray-900">
              {format(selectedDate, "MMMM yyyy")}
            </h2>
            <Button
              variant="ghost" 
              size="sm"
              icon="ChevronRight"
              onClick={handleNextMonth}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              icon="Calendar"
              onClick={handleTodayClick}
            >
              Today
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Students</p>
                <p className="text-2xl font-bold text-blue-800">{students.length}</p>
              </div>
              <ApperIcon name="Users" className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Present Today</p>
                <p className="text-2xl font-bold text-green-800">
                  {attendance.filter(a => 
                    a.date === new Date().toISOString().split("T")[0] && 
                    a.status === "present"
                  ).length}
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
                <p className="text-sm font-medium text-yellow-700">This Month</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {Math.round(
                    (attendance.filter(a => {
                      const attendanceDate = new Date(a.date);
                      return attendanceDate.getMonth() === selectedDate.getMonth() && 
                             attendanceDate.getFullYear() === selectedDate.getFullYear() &&
                             a.status === "present";
                    }).length / Math.max(1, students.length)) * 100
                  )}%
                </p>
              </div>
              <ApperIcon name="TrendingUp" className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Attendance Grid */}
      <AttendanceGrid
        students={students}
        attendance={attendance}
        selectedDate={selectedDate}
        onAttendanceUpdated={loadAttendanceData}
      />
    </div>
  );
};

export default Attendance;