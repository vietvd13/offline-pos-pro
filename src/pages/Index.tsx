
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Users, 
  Store, 
  ArrowRight, 
  BarChart 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

// Mock data for dashboard metrics
interface DashboardStats {
  dailySales: number;
  totalProducts: number;
  lowStockItems: number;
  activeBranches: number;
  totalUsers: number;
  recentTransactions: {
    id: string;
    date: Date;
    amount: number;
    items: number;
    customer?: string;
    status: "completed" | "pending" | "canceled";
  }[];
}

// Sample data
const sampleStats: DashboardStats = {
  dailySales: 2450.75,
  totalProducts: 235,
  lowStockItems: 12,
  activeBranches: 3,
  totalUsers: 8,
  recentTransactions: [
    {
      id: "TX-12345",
      date: new Date(),
      amount: 125.50,
      items: 3,
      customer: "Walk-in Customer",
      status: "completed"
    },
    {
      id: "TX-12344",
      date: new Date(),
      amount: 78.25,
      items: 2,
      customer: "John Smith",
      status: "completed"
    },
    {
      id: "TX-12343",
      date: new Date(),
      amount: 250.00,
      items: 1,
      customer: "Sarah Johnson",
      status: "completed"
    }
  ]
};

const Index = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Mock API call to get dashboard stats
    const fetchStats = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setStats(sampleStats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    // Setup online/offline listener
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Overview of your POS system</p>
          </div>
          
          <div className="flex items-center gap-2">
            {!isOnline && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Offline Mode
              </Badge>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-pulse text-gray-400">Loading dashboard data...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="pos-stat-card border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Daily Sales</p>
                      <h3 className="text-2xl font-bold">${stats?.dailySales.toFixed(2)}</h3>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="pos-stat-card border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Products</p>
                      <h3 className="text-2xl font-bold">{stats?.totalProducts}</h3>
                      <p className="text-xs text-red-500">{stats?.lowStockItems} low stock items</p>
                    </div>
                    <Package className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="pos-stat-card border-l-purple-500">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Branches</p>
                      <h3 className="text-2xl font-bold">{stats?.activeBranches}</h3>
                    </div>
                    <Store className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="pos-stat-card border-l-amber-500">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Users</p>
                      <h3 className="text-2xl font-bold">{stats?.totalUsers}</h3>
                    </div>
                    <Users className="h-8 w-8 text-amber-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link to="/pos">
                    <Button variant="outline" className="h-20 w-full flex flex-col items-center justify-center gap-1">
                      <ShoppingCart size={20} className="text-blue-500" />
                      <span>New Sale</span>
                    </Button>
                  </Link>
                  <Link to="/products">
                    <Button variant="outline" className="h-20 w-full flex flex-col items-center justify-center gap-1">
                      <Package size={20} className="text-green-500" />
                      <span>Products</span>
                    </Button>
                  </Link>
                  <Link to="/branches">
                    <Button variant="outline" className="h-20 w-full flex flex-col items-center justify-center gap-1">
                      <Store size={20} className="text-purple-500" />
                      <span>Branches</span>
                    </Button>
                  </Link>
                  <Link to="/reports">
                    <Button variant="outline" className="h-20 w-full flex flex-col items-center justify-center gap-1">
                      <BarChart size={20} className="text-amber-500" />
                      <span>Reports</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Link to="/reports" className="flex items-center text-sm text-blue-500 hover:underline">
                  <span>View all</span>
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">ID</th>
                        <th className="text-left py-2 font-medium">Date</th>
                        <th className="text-right py-2 font-medium">Amount</th>
                        <th className="text-right py-2 font-medium">Items</th>
                        <th className="text-left py-2 font-medium">Customer</th>
                        <th className="text-center py-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.recentTransactions.map((tx) => (
                        <tr key={tx.id} className="border-b">
                          <td className="py-2">{tx.id}</td>
                          <td className="py-2">{tx.date.toLocaleDateString()}</td>
                          <td className="py-2 text-right">${tx.amount.toFixed(2)}</td>
                          <td className="py-2 text-right">{tx.items}</td>
                          <td className="py-2">{tx.customer || 'Walk-in'}</td>
                          <td className="py-2 text-center">
                            <Badge className={`
                              ${tx.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                              ${tx.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                              ${tx.status === 'canceled' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                            `}>
                              {tx.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Index;
