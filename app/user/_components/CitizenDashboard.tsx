import { useAuth } from "@/app/context/AuthContext";
import { handleFetchReportStats } from "@/lib/actions/auth-actions";
import { handleGetMyRecentIssues } from "@/lib/actions/issue-actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Card, StatusBadge } from "./Shared";
import { Icons, IssueStatus } from "../constants";

interface RecentIssue {
    _id: string;
    title: string;
    category: string;
    location: string;
    description: string;
    status: IssueStatus;
    priority: string;
    createdAt: string;
    updatedAt: string;
    reportedBy: {
        _id: string;
        fullname: string;
        email: string;
    };
    issueImages?: string[];
    latitude?: number;
    longitude?: number;
}

export function CitizenDashboard() {
    const router = useRouter();
    const { user } = useAuth();

    const [reportStats, setReportStats] = useState({
        totalReports: 0,
        pendingReports: 0,
        resolvedReports: 0,
        inprogressReports: 0,
    });
    const [recentIssues, setRecentIssues] = useState<RecentIssue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        Promise.all([
            handleFetchReportStats(),
            handleGetMyRecentIssues(),
        ]).then(([statsRes, issuesRes]) => {
            if (statsRes.success && statsRes.data) setReportStats(statsRes.data);
            if (issuesRes.success && issuesRes.data) setRecentIssues(issuesRes.data);
        }).finally(() => setLoading(false));
    }, [user])

    const stats = [
        { label: 'My Total Reports',       value: reportStats.totalReports,      color: 'text-blue-600',  bg: 'bg-blue-50',  icon: Icons.Report },
        { label: 'Pending Verification',   value: reportStats.pendingReports,    color: 'text-amber-600', bg: 'bg-amber-50', icon: Icons.Map },
        { label: 'In Progress',            value: reportStats.inprogressReports, color: 'text-blue-500',  bg: 'bg-blue-50',  icon: Icons.Report },
        { label: 'Resolved Issues',        value: reportStats.resolvedReports,   color: 'text-teal-600',  bg: 'bg-teal-50',  icon: Icons.ChevronRight },
    ];

    if (loading) {
        return (
            <div className="mt-8 space-y-6 animate-pulse ml-40">
                <div className="h-8 bg-slate-200 rounded w-1/3" />
                <div className="grid grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-slate-100 rounded-xl" />
                    ))}
                </div>
                <div className="h-64 bg-slate-100 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 mt-8 mb-16 ml-40">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">
                        Welcome back, {user?.fullname?.split(' ')[0]}
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Track your reports and help us keep the town beautiful.
                    </p>
                </div>
                <Button onClick={() => router.push('/user/reportIssue')} className="flex items-center space-x-2">
                    <Icons.Report />
                    <span>Report New Issue</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="group hover:border-teal-200 transition-all cursor-default">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                            </div>
                            <div className={`p-2 ${stat.bg} rounded-lg ${stat.color} group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors`}>
                                <stat.icon />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card title="Your Recent Activity">
                        {recentIssues.length === 0 ? (
                            <div className="py-12 text-center text-slate-400">
                                <p className="text-sm">No recent reports found.</p>
                                <button
                                    onClick={() => router.push('/user/reportIssue')}
                                    className="mt-3 text-teal-600 text-sm font-medium hover:underline"
                                >
                                    Report your first issue →
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                            <th className="pb-4">Report Info</th>
                                            <th className="pb-4">Category</th>
                                            <th className="pb-4">Date</th>
                                            <th className="pb-4">Status</th>
                                            <th className="pb-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {recentIssues.map((issue) => (
                                            <tr key={issue._id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="py-4">
                                                    <div>
                                                        <p className="font-semibold text-slate-700 text-sm">{issue.title}</p>
                                                        <p className="text-xs text-slate-400 font-mono mt-0.5">{issue._id.slice(-8).toUpperCase()}</p>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-sm text-slate-600">{issue.category}</td>
                                                <td className="py-4 text-sm text-slate-500">
                                                    {new Date(issue.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric', year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="py-4">
                                                    <StatusBadge status={issue.status} />
                                                </td>
                                                <td className="py-4">
                                                    <button
                                                        onClick={() => router.push(`/user/reports/${issue._id}`)}
                                                        className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center space-x-1"
                                                    >
                                                        <span>View</span>
                                                        <Icons.ChevronRight />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <button
                                onClick={() => router.push('/user/reports')}
                                className="text-sm text-teal-600 font-medium hover:underline"
                            >
                                View all reports →
                            </button>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="Quick Map View">
                        <div className="aspect-square bg-slate-100 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-slate-200 relative overflow-hidden">
                            <div className="relative bg-white p-4 rounded-xl shadow-lg border border-slate-200 text-center">
                                <Icons.Map />
                                <p className="mt-2 text-sm font-semibold text-slate-700">Visualize Reports</p>
                                <button
                                    onClick={() => router.push('/user/reports')}
                                    className="mt-2 text-xs text-teal-600 font-bold hover:underline"
                                >
                                    Open Full Map
                                </button>
                            </div>
                        </div>
                    </Card>

                    <div className="bg-teal-900 text-white rounded-xl p-5">
                        <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                            <span className="w-5 h-5 bg-teal-500 rounded flex items-center justify-center text-xs">?</span>
                            Pro Tips
                        </h3>
                        <ul className="space-y-2 text-xs text-teal-100">
                            <li className="flex items-start gap-2">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                                Use the map picker for precise locations.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                                Clear photos help crews identify issues faster.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                                Report during daylight for better photo quality.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}