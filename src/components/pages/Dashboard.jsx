import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import studentService from "@/services/api/studentService";
import attendanceService from "@/services/api/attendanceService";
import gradeService from "@/services/api/gradeService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [studentsData, attendanceData, gradesData] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll(),
        gradeService.getAll()
      ]);
      
      setStudents(studentsData);
      setAttendance(attendanceData);
      setGrades(gradesData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === "Active").length;
  
  // Calculate today's attendance rate
  const today = new Date().toISOString().split("T")[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const presentToday = todayAttendance.filter(a => a.status === "present").length;
  const attendanceRate = activeStudents > 0 ? Math.round((presentToday / activeStudents) * 100) : 0;
  
  // Calculate average grade
  const validGrades = grades.filter(g => g.score !== null);
  const averageGrade = validGrades.length > 0 
    ? Math.round(validGrades.reduce((sum, g) => sum + g.score, 0) / validGrades.length)
    : 0;

  // Get recent activity (last 5 students)
const recentStudents = students
    .sort((a, b) => new Date(b.enrollment_date_c) - new Date(a.enrollment_date_c))
    .slice(0, 5);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <Loading type="cards" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <Error
          title="Dashboard Error"
          message={error}
          onRetry={loadDashboardData}
        />
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <Empty
          title="Welcome to ClassHub"
          message="Start by adding your first student to begin managing your classroom."
          icon="Users"
          actionLabel="Add First Student"
          onAction={() => navigate("/students")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-secondary-600">Welcome back! Here's what's happening in your classroom.</p>
        </div>
        <Button
          variant="accent"
          icon="Plus"
          onClick={() => navigate("/students")}
        >
          Add Student
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon="Users"
          color="primary"
        />
        <StatCard
          title="Active Students"
          value={activeStudents}
          icon="UserCheck"
          color="accent"
        />
        <StatCard
          title="Today's Attendance"
          value={`${attendanceRate}%`}
          icon="Calendar"
          color="info"
          trend={attendanceRate >= 90 ? "up" : "down"}
          trendValue={`${presentToday}/${activeStudents} present`}
        />
        <StatCard
          title="Class Average"
          value={`${averageGrade}%`}
          icon="BookOpen"
          color="warning"
          trend={averageGrade >= 80 ? "up" : "down"}
          trendValue={`${validGrades.length} assignments`}
        />
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Students</h3>
              <Button
                variant="ghost"
                size="sm"
                icon="ArrowRight"
                onClick={() => navigate("/students")}
              >
                View All
              </Button>
            </div>
            <div className="space-y-3">
{recentStudents.map((student) => (
                <div key={student.Id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-transparent rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      initials={getInitials(student.first_name_c, student.last_name_c)}
                      size="sm"
                    />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {student.first_name_c} {student.last_name_c}
                      </div>
                      <div className="text-xs text-secondary-500">
                        Enrolled: {formatDate(student.enrollment_date_c)}
                      </div>
                    </div>
                  </div>
                  <Badge variant="grade" size="sm">
                    Grade {student.grade_level_c}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                icon="Calendar"
                onClick={() => navigate("/attendance")}
                className="w-full justify-start"
              >
                Take Today's Attendance
              </Button>
              <Button
                variant="outline"
                icon="BookOpen"
                onClick={() => navigate("/grades")}
                className="w-full justify-start"
              >
                Enter Grades
              </Button>
              <Button
                variant="outline"
                icon="UserPlus"
                onClick={() => navigate("/students")}
                className="w-full justify-start"
              >
                Add New Student
              </Button>
              <Button
                variant="outline"
                icon="BarChart3"
                onClick={() => {
                  // Future: Navigate to reports page
                  console.log("Reports feature coming soon!");
                }}
                className="w-full justify-start"
              >
                View Reports
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Attendance Overview */}
      {activeStudents > 0 && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Today's Attendance Overview</h3>
              <Button
                variant="ghost"
                size="sm"
                icon="Calendar"
                onClick={() => navigate("/attendance")}
              >
                Manage Attendance
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Present</p>
                    <p className="text-2xl font-bold text-green-800">{presentToday}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700">Late</p>
                    <p className="text-2xl font-bold text-yellow-800">
                      {todayAttendance.filter(a => a.status === "late").length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">!</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700">Absent</p>
                    <p className="text-2xl font-bold text-red-800">
                      {todayAttendance.filter(a => a.status === "absent").length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✗</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;