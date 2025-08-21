import { cn } from "@/utils/cn";

const Loading = ({ className, rows = 5, type = "table" }) => {
  if (type === "cards") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded shimmer mb-3"></div>
                  <div className="h-8 bg-gray-300 rounded shimmer w-20"></div>
                </div>
                <div className="w-12 h-12 bg-gray-300 rounded-lg shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "student-cards") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full shimmer"></div>
              <div>
                <div className="h-4 bg-gray-300 rounded shimmer w-24 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded shimmer w-32"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-300 rounded shimmer w-full"></div>
              <div className="h-3 bg-gray-300 rounded shimmer w-3/4"></div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-gray-300 rounded-full shimmer w-16"></div>
                <div className="h-6 bg-gray-300 rounded-full shimmer w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="w-10 h-10 bg-gray-300 rounded-full shimmer"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded shimmer w-1/4"></div>
            <div className="h-3 bg-gray-300 rounded shimmer w-1/2"></div>
          </div>
          <div className="w-16 h-6 bg-gray-300 rounded-full shimmer"></div>
          <div className="w-20 h-8 bg-gray-300 rounded shimmer"></div>
        </div>
      ))}
    </div>
  );
};

export default Loading;