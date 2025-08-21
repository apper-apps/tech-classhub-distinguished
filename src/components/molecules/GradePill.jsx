import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";

const GradePill = ({ score, totalPoints, showPercentage = true }) => {
  if (score === null || score === undefined) {
    return (
      <Badge variant="default" size="sm">
        Not Graded
      </Badge>
    );
  }

  const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
  
  const getGradeVariant = (percent) => {
    if (percent >= 90) return "success";
    if (percent >= 80) return "info"; 
    if (percent >= 70) return "warning";
    return "error";
  };

  const getLetterGrade = (percent) => {
    if (percent >= 90) return "A";
    if (percent >= 80) return "B";
    if (percent >= 70) return "C"; 
    if (percent >= 60) return "D";
    return "F";
  };

  return (
    <Badge variant={getGradeVariant(percentage)} size="sm">
      {showPercentage ? `${percentage}%` : getLetterGrade(percentage)}
    </Badge>
  );
};

export default GradePill;