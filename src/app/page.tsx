import { ArrowRight, BarChart, Bell } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-16 max-h-[calc(100vh-56px)] w-full overflow-y-auto p-6">
      <div className="flex flex-col gap-y-4">
        <h1 className="text-2xl font-semibold">Recently viewed dashboards</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card />
          <Card />
          <Card />
        </div>
      </div>
      <div className="flex flex-col gap-y-4">
        <QuickActionsCard />
      </div>
      <KeyPerformanceMetrics />
      <GlobalAnnouncements />
      <TipsForUsingPlatform />
    </div>
  );
}

// Card.tsx
const Card: React.FC = () => {
  return (
    <div className="pl-4 rounded-xl shadow-inner bg-gradient-to-r from-teal-500 to-teal-700 w-full ">
      <div className=" rounded-r-xl border-l overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="relative w-full">
          {/* Left Gradient Section */}

          {/* Card Content */}
          <div className="relative bg-white p-6 rounded-r-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Stunning Card Title
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              This is an example of a beautiful card with a gradient on the left
              side and rounded corners.
            </p>

            <button className="bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-700 transition-all duration-200 flex items-center gap-x-1.5">
              Dashboard
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// QuickActionsCard.tsx
import { Settings, PlusCircle } from "lucide-react";

const QuickActionsCard: React.FC = () => {
  return (
    <div className="rounded-xl border overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="bg-white p-6 rounded-xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          Use the following actions to manage your tasks quickly and
          efficiently.
        </p>

        {/* Action Buttons in a horizontal layout */}
        <div className="flex flex-wrap gap-6">
          <button className="bg-teal-600 text-white px-6 py-3 rounded-full hover:bg-teal-700 transition-all duration-200 flex items-center gap-x-2">
            <PlusCircle className="h-5 w-5" />
            Add Database
          </button>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-200 flex items-center gap-x-2">
            <BarChart className="h-5 w-5" />
            Create Chart
          </button>
          <button className="bg-yellow-600 text-white px-6 py-3 rounded-full hover:bg-yellow-700 transition-all duration-200 flex items-center gap-x-2">
            <Bell className="h-5 w-5" />
            Set Alert
          </button>
          <button className="bg-gray-600 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition-all duration-200 flex items-center gap-x-2">
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

// KeyPerformanceMetrics.tsx
import { ArrowUpCircle, ArrowDownCircle, Users, DollarSign } from "lucide-react";

const KeyPerformanceMetrics: React.FC = () => {
  return (
    <div className="space-y-6 md:p-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Key Performance Metrics</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Metric Card 1 */}
        <div className="bg-white border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex items-center space-x-4">
          <div className="bg-teal-500 text-white p-4 rounded-full">
            <ArrowUpCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Revenue</h3>
            <p className="text-sm text-gray-600 mb-2">Total revenue for the month</p>
            <div className="text-2xl font-bold text-teal-600">$12,300</div>
            <div className="w-full bg-teal-200 rounded-full h-2 mt-2">
              <div className="bg-teal-600 h-2 rounded-full" style={{ width: "80%" }}></div>
            </div>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-white border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex items-center space-x-4">
          <div className="bg-blue-500 text-white p-4 rounded-full">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Active Users</h3>
            <p className="text-sm text-gray-600 mb-2">Users actively engaging with the app</p>
            <div className="text-2xl font-bold text-blue-600">3,250</div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "65%" }}></div>
            </div>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-white border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex items-center space-x-4">
          <div className="bg-red-500 text-white p-4 rounded-full">
            <ArrowDownCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Churn Rate</h3>
            <p className="text-sm text-gray-600 mb-2">Rate of users leaving the platform</p>
            <div className="text-2xl font-bold text-red-600">5.3%</div>
            <div className="w-full bg-red-200 rounded-full h-2 mt-2">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: "30%" }}></div>
            </div>
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="bg-white border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex items-center space-x-4">
          <div className="bg-green-500 text-white p-4 rounded-full">
            <BarChart className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Growth Rate</h3>
            <p className="text-sm text-gray-600 mb-2">Growth in the number of users</p>
            <div className="text-2xl font-bold text-green-600">12%</div>
            <div className="w-full bg-green-200 rounded-full h-2 mt-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: "60%" }}></div>
            </div>
          </div>
        </div>

        {/* Metric Card 5 */}
        <div className="bg-white border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex items-center space-x-4">
          <div className="bg-yellow-500 text-white p-4 rounded-full">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Profit</h3>
            <p className="text-sm text-gray-600 mb-2">Profit made in the current quarter</p>
            <div className="text-2xl font-bold text-yellow-600">$5,800</div>
            <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
              <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "75%" }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// GlobalAnnouncements.tsx
import { AlertCircle } from "lucide-react";

const GlobalAnnouncements: React.FC = () => {
  return (
    <div className="space-y-6 md:p-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Global Announcements</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Announcement Card 1 */}
        <div className="border border-teal-500 p-6 rounded-xl shadow-lg flex items-start space-x-4">
          <div className="bg-teal-500 text-white p-4 rounded-full">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-teal-700">New Feature Launch</h3>
            <p className="text-gray-700 text-sm">
              We&apos;re launching a new analytics dashboard next week! Stay tuned for a better user experience.
            </p>
            <button className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition-all duration-200">
              Read More
            </button>
          </div>
        </div>

        {/* Announcement Card 2 */}
        <div className="border border-teal-500 p-6 rounded-xl shadow-lg flex items-start space-x-4">
          <div className="bg-teal-500 text-white p-4 rounded-full">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-teal-700">Scheduled Maintenance</h3>
            <p className="text-gray-700 text-sm">
              Our platform will undergo scheduled maintenance on the 15th. Expect downtime from 2:00 AM to 4:00 AM.
            </p>
            <button className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// TipsForUsingPlatform.tsx
import { Lightbulb } from "lucide-react";

const TipsForUsingPlatform: React.FC = () => {
  return (
    <div className="space-y-6 md:p-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Tips for Using the Platform</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Tip Card 1 */}
        <div className="bg-teal-50 border p-6 rounded-xl shadow-lg flex items-start space-x-4">
          <div className="bg-teal-500 text-white p-4 rounded-full">
            <Lightbulb className="h-6 w-6" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-teal-700">Customize Your Dashboard</h3>
            <p className="text-gray-700 text-sm">
              Personalize your dashboard by adding the widgets you need for quick insights.
            </p>
            <button className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>

        {/* Tip Card 2 */}
        <div className="bg-teal-50 border p-6 rounded-xl shadow-lg flex items-start space-x-4">
          <div className="bg-teal-500 text-white p-4 rounded-full">
            <Lightbulb className="h-6 w-6" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-teal-700">Set Alerts for Important Events</h3>
            <p className="text-gray-700 text-sm">
              Configure alerts to notify you when your KPIs go above or below certain thresholds.
            </p>
            <button className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition-all duration-200">
              Set Alerts
            </button>
          </div>
        </div>

        {/* Tip Card 3 */}
        <div className="bg-teal-50 border p-6 rounded-xl shadow-lg flex items-start space-x-4">
          <div className="bg-teal-500 text-white p-4 rounded-full">
            <Lightbulb className="h-6 w-6" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-teal-700">Integrate with Third-Party Tools</h3>
            <p className="text-gray-700 text-sm">
              Seamlessly integrate your platform with popular third-party tools to streamline your workflow.
            </p>
            <button className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition-all duration-200">
              Explore Integrations
            </button>
          </div>
        </div>

        {/* Tip Card 4 */}
        <div className="bg-teal-50 border p-6 rounded-xl shadow-lg flex items-start space-x-4">
          <div className="bg-teal-500 text-white p-4 rounded-full">
            <Lightbulb className="h-6 w-6" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-teal-700">Track Performance in Real-Time</h3>
            <p className="text-gray-700 text-sm">
              Monitor your key performance metrics in real-time using the live dashboard feature.
            </p>
            <button className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition-all duration-200">
              Track Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

