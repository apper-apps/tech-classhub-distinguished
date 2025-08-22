import { useState } from "react";
import { toast } from "react-toastify";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWeekend } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import AttendanceToggle from "@/components/molecules/AttendanceToggle";
import attendanceService from "@/services/api/attendanceService";
import ApperIcon from "@/components/ApperIcon";

const AttendanceGrid = ({ students = [], attendance = [], selectedDate, onAttendanceUpdated }) => {
  const [loading, setLoading] = useState(false);

  const monthDays = eachDayOfInterval({
    start: startOfMonth(selectedDate),
    end: endOfMonth(selectedDate)
  });

  const schoolDays = monthDays.filter(day => !isWeekend(day));

  const getAttendanceStatus = (studentId, date) => {
    const record = attendance.find(a => 
      a.studentId === studentId && 
      isSameDay(new Date(a.date), date)
    );
    return record?.status || "";
  };

  const handleAttendanceChange = async (studentId, date, newStatus) => {
    setLoading(true);
    try {
      const existingRecord = attendance.find(a => 
        a.studentId === studentId && 
        isSameDay(new Date(a.date), date)
      );

      if (existingRecord) {
        if (newStatus === "") {
          await attendanceService.delete(existingRecord.Id);
        } else {
          await attendanceService.update(existingRecord.Id, {
            ...existingRecord,
            status: newStatus
          });
        }
      } else if (newStatus !== "") {
        await attendanceService.create({
          studentId: studentId,
          date: date.toISOString().split("T")[0],
          status: newStatus,
          notes: ""
        });
      }

      onAttendanceUpdated?.();
      toast.success("Attendance updated successfully!");
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error("Failed to update attendance");
    } finally {
      setLoading(false);
    }
  };

  const markAllPresent = async (date) => {
    setLoading(true);
    try {
      for (const student of students) {
        const existingRecord = attendance.find(a => 
          a.studentId === student.Id && 
          isSameDay(new Date(a.date), date)
        );

        if (existingRecord) {
          await attendanceService.update(existingRecord.Id, {
            ...existingRecord,
            status: "present"
          });
        } else {
          await attendanceService.create({
            studentId: student.Id,
            date: date.toISOString().split("T")[0],
            status: "present",
            notes: ""
          });
        }
      }

      onAttendanceUpdated?.();
      toast.success("All students marked present!");
    } catch (error) {
      console.error("Error marking all present:", error);
      toast.error("Failed to mark all present");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Month Header */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {format(selectedDate, "MMMM yyyy")} Attendance
            </h3>
            <div className="flex items-center space-x-2 text-sm text-secondary-600">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Present</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Late</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Absent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px] p-4">
            {/* Header with dates */}
            <div className="grid grid-cols-[200px_1fr] gap-4 mb-4">
              <div className="font-medium text-secondary-700">Student</div>
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(schoolDays.length, 10)}, 1fr)` }}>
                {schoolDays.slice(0, 10).map((day) => (
                  <div key={day.toString()} className="text-center">
                    <div className="text-xs text-secondary-500 mb-1">
                      {format(day, "EEE")}
                    </div>
                    <div className="text-sm font-medium text-secondary-700 mb-2">
                      {format(day, "d")}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAllPresent(day)}
                      disabled={loading}
                      className="text-xs px-1 py-1 h-6"
                      title="Mark all present"
                    >
                      <ApperIcon name="Check" className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Student rows */}
            <div className="space-y-3">
              {students.map((student) => (
                <div key={student.Id} className="grid grid-cols-[200px_1fr] gap-4 items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
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
                        Grade {student.grade_level_c}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-2 justify-items-center" style={{ gridTemplateColumns: `repeat(${Math.min(schoolDays.length, 10)}, 1fr)` }}>
                    {schoolDays.slice(0, 10).map((day) => (
                      <AttendanceToggle
                        key={`${student.Id}-${day.toString()}`}
                        status={getAttendanceStatus(student.Id, day)}
                        onChange={(newStatus) => handleAttendanceChange(student.Id, day, newStatus)}
                        disabled={loading}
                        size="sm"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AttendanceGrid;