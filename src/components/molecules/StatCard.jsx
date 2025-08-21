import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = "primary",
  className
}) => {
  const colors = {
    primary: {
      bg: "bg-gradient-to-br from-primary-500 to-primary-600",
      icon: "text-primary-100",
      text: "text-white"
    },
    accent: {
      bg: "bg-gradient-to-br from-accent-500 to-accent-600", 
      icon: "text-accent-100",
      text: "text-white"
    },
    warning: {
      bg: "bg-gradient-to-br from-yellow-500 to-orange-500",
      icon: "text-yellow-100", 
      text: "text-white"
    },
    info: {
      bg: "bg-gradient-to-br from-blue-500 to-indigo-500",
      icon: "text-blue-100",
      text: "text-white"
    }
  };

  return (
    <Card hover className={cn("overflow-hidden", className)}>
      <div className={cn("p-6", colors[color].bg)}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={cn("text-sm font-medium opacity-90", colors[color].text)}>
              {title}
            </p>
            <p className={cn("text-3xl font-bold mt-2", colors[color].text)}>
              {value}
            </p>
            {trend && trendValue && (
              <div className="flex items-center mt-3">
                <ApperIcon 
                  name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                  className={cn("w-4 h-4 mr-1", colors[color].text, "opacity-90")} 
                />
                <span className={cn("text-sm", colors[color].text, "opacity-90")}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-lg bg-white/20 backdrop-blur-sm")}>
            <ApperIcon name={icon} className={cn("w-6 h-6", colors[color].icon)} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;