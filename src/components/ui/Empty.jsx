import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Empty = ({ 
  title = "No data found",
  message = "Get started by adding your first item.",
  icon = "Inbox",
  actionLabel,
  onAction
}) => {
  return (
    <Card className="max-w-md mx-auto">
      <div className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-8 h-8 text-secondary-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-secondary-600 mb-6">
          {message}
        </p>
        {actionLabel && onAction && (
          <Button 
            onClick={onAction}
            variant="accent"
            icon="Plus"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Empty;