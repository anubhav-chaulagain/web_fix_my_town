"use client";
import { useAuth } from "@/app/context/AuthContext";
import { Icons, IssueStatus } from "../constants";
import { useRouter } from "next/navigation";
import { Button, Card, StatusBadge } from "../_components/Shared";
import { useEffect, useState } from "react";
import { handleFetchReportStats } from "@/lib/actions/auth-actions";
import { handleGetMyRecentIssues } from "@/lib/actions/issue-actions";

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

export default function Page() {
    
    const router = useRouter();
    const { user }  = useAuth();
    const isAuthority = user?.role === 'authority';
    const [reportStats, setReportStats] = useState({
                totalReports: 0,
                pendingReports: 0,
                resolvedReports: 0,
                inprogressReports: 0,
            });
    const [recentIssues, setRecentIssues] = useState<RecentIssue[]>([]);
    useEffect(() => {
            const fetchStats = async () => {
                const response = await handleFetchReportStats();
                if (response.success) {
                    setReportStats(response.data);
                }
            };
            fetchStats();
        }, []);
    
    useEffect(() => {
        const fetchRecentIssues = async () => {
            const response = await handleGetMyRecentIssues();
            if (response.success && response.data) {
                setRecentIssues(response.data);
            }
        };
        fetchRecentIssues();
    }, []);

    console.log("Recent Issues:", recentIssues);

    const stats = isAuthority ? [
    { label: 'Incoming Reports', value: reportStats.totalReports, color: 'text-blue-600', icon: Icons.Report },
    { label: 'Open Issues', value: reportStats.pendingReports, color: 'text-amber-600', icon: Icons.Map },
    { label: 'Resolved Today', value: reportStats.resolvedReports, color: 'text-teal-600', icon: Icons.ChevronRight },
    { label: 'Avg Resolution Time', value: '2.4 days', color: 'text-slate-600', icon: Icons.Dashboard },
  ] : [
    { label: 'My Total Reports', value: reportStats.totalReports, color: 'text-blue-600', icon: Icons.Report },
    { label: 'Pending Verification', value: reportStats.pendingReports, color: 'text-amber-600', icon: Icons.Map },
    { label: 'In Progress', value: reportStats.inprogressReports, color: 'text-blue-500', icon: Icons.Report },
    { label: 'Resolved Issues', value: reportStats.resolvedReports, color: 'text-teal-600', icon: Icons.ChevronRight },
  ];
  
    return (
        <div className="space-y-8 animate-in fade-in duration-500 mt-8 mb-16 ml-40">
            <div className="flex justify-between items-end">
                <div>
                <h2 className="text-3xl font-bold text-slate-900">Welcome back, {user?.fullname.split(' ')[0]}</h2>
                <p className="text-slate-500 mt-1">
                    {isAuthority 
                    ? "Here's the current overview of town issues and management tasks." 
                    : "Track your reports and help us keep the town beautiful."}
                </p>
                </div>
                {!isAuthority && (
                <Button onClick={() => router.push('/report')} className="flex items-center space-x-2">
                    <Icons.Report />
                    <span>Report New Issue</span>
                </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                <Card key={i} className="group hover:border-teal-200 transition-all cursor-default">
                    <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                        <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                        <stat.icon />
                    </div>
                    </div>
                </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                <Card title={isAuthority ? "Management Overview" : "Your Recent Activity"}>
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
                                        <p className="text-xs text-slate-400 font-mono mt-0.5">{issue._id}</p>
                                    </div>
                                </td>
                                <td className="py-4 text-sm text-slate-600">{issue.category}</td>
                                <td className="py-4 text-sm text-slate-500">
                                    {new Date(issue.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
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
                </Card>
            </div>
        </div>
    </div>
    );
}