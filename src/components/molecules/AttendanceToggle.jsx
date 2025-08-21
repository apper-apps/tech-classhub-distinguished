import { cn } from "@/utils/cn";

const AttendanceToggle = ({ 
  status, 
  onChange, 
  size = "md",
  disabled = false 
}) => {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  const getStatusStyle = (currentStatus) => {
    switch (currentStatus) {
      case "present":
        return "bg-gradient-to-br from-green-400 to-green-500 border-green-400 text-white";
      case "absent":
        return "bg-gradient-to-br from-red-400 to-red-500 border-red-400 text-white";
      case "late":
        return "bg-gradient-to-br from-yellow-400 to-yellow-500 border-yellow-400 text-white";
      default:
        return "bg-gray-100 border-gray-300 text-gray-400 hover:bg-gray-200";
    }
  };

  const getStatusSymbol = (currentStatus) => {
    switch (currentStatus) {
      case "present": return "✓";
      case "absent": return "✗";  
      case "late": return "!";
      default: return "";
    }
  };

  const handleClick = () => {
    if (disabled) return;
    
    const statusOrder = ["", "present", "late", "absent"];
    const currentIndex = statusOrder.indexOf(status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    onChange(statusOrder[nextIndex]);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2",
        sizes[size],
        getStatusStyle(status),
        disabled && "opacity-50 cursor-not-allowed hover:scale-100"
      )}
    >
      {getStatusSymbol(status)}
    </button>
  );
};

export default AttendanceToggle;