import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Error = ({ 
  title = "Something went wrong",
  message = "We encountered an error while loading your data.",
  onRetry,
  showRetry = true
}) => {
  return (
    <Card className="max-w-md mx-auto">
      <div className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-secondary-600 mb-6">
          {message}
        </p>
        {showRetry && onRetry && (
          <Button 
            onClick={onRetry}
            variant="accent"
            icon="RefreshCw"
          >
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Error;