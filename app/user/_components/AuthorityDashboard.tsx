"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icons } from "../constants";
import { handleFetchAuthorityStats } from "@/lib/actions/auth-actions";
import { handleGetMyAssignedIssues } from "@/lib/actions/issue-actions";
import { Button, Card, StatusBadge } from "./Shared";
import Image from "next/image";

type IssueStatus = 'pending' | 'in-progress' | 'resolved' | 'rejected';

interface RecentIssue {
    _id: string;
    title: string;
    category: string;
    location: string;
    status: IssueStatus;
    priority: string;
    createdAt: string;
    assignedTo?: { _id: string; fullname: string; };
    reportedBy: { _id: string; fullname: string; email: string; };
    issueImages?: string[];
}

interface AuthorityStats {
    assignedIssues: number;
    completedIssues: number;
    department: string;
    employeeId: string;
}

function PriorityBadge({ priority }: { priority: string }) {
    const styles: Record<string, string> = {
        low:    'bg-slate-100 text-slate-600',
        medium: 'bg-amber-50 text-amber-700',
        high:   'bg-orange-50 text-orange-700',
        urgent: 'bg-red-50 text-red-700',
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${styles[priority] ?? styles.medium}`}>
            {priority}
        </span>
    );
}

export function AuthorityDashboard() {
    const router = useRouter();
    const { user } = useAuth();

    const [authorityStats, setAuthorityStats] = useState<AuthorityStats>({
        assignedIssues: 0,
        completedIssues: 0,
        department: '',
        employeeId: '',
    });
    const [activeWorklist, setActiveWorklist] = useState<RecentIssue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [statsRes, activeIssuesRes] = await Promise.all([
                    handleFetchAuthorityStats(),
                    // Use the new dedicated endpoint
                    handleGetMyAssignedIssues({ 
                        status: 'in-progress',
                        page: 1, 
                        size: '10' 
                    }),
                ]);

                if (statsRes.success && statsRes.data) {
                    setAuthorityStats(statsRes.data);
                }
                if (activeIssuesRes.success && activeIssuesRes.data) {
                    setActiveWorklist(activeIssuesRes.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAll();
    }, [user]);

    const stats = [
        {
            label: 'Assigned to Me',
            value: authorityStats.assignedIssues,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            icon: Icons.Report,
        },
        {
            label: 'Completed Issues',
            value: authorityStats.completedIssues,
            color: 'text-teal-600',
            bg: 'bg-teal-50',
            icon: Icons.ChevronRight,
        },
        {
            label: 'Department',
            value: authorityStats.department || '—',
            color: 'text-slate-700',
            bg: 'bg-slate-50',
            icon: Icons.Dashboard,
        },
        {
            label: 'Employee ID',
            value: authorityStats.employeeId || '—',
            color: 'text-slate-700',
            bg: 'bg-slate-50',
            icon: Icons.Profile,
        },
    ];

    if (loading) {
        return (
            <div className="mt-8 space-y-6 animate-pulse">
                <div className="h-8 bg-slate-200 rounded w-1/3" />
                <div className="grid grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-slate-100 rounded-xl" />)}
                </div>
                <div className="h-64 bg-slate-100 rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 mt-8 mb-16 ml-40">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Operational Command</h2>
                    <p className="text-slate-500 mt-1">
                        Welcome back, {user?.fullname?.split(' ')[0]} · {authorityStats.department}
                    </p>
                </div>
                <Button type="button" onClick={() => router.push('/user/reports')}>
                    View All Issues
                </Button>
            </div>

            {/* Stats */}
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

            {/* Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Worklist Table */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="My Active Worklist">
                        <div className="overflow-x-auto">
                            {activeWorklist.length > 0 ? (
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                            <th className="pb-4">Report</th>
                                            <th className="pb-4 text-center">Priority</th>
                                            <th className="pb-4">Category</th>
                                            <th className="pb-4">Status</th>
                                            <th className="pb-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {activeWorklist.map((issue) => (
                                            <tr key={issue._id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded bg-slate-100 overflow-hidden shrink-0">
                                                            {issue.issueImages?.[0] ? (
                                                                <Image 
                                                                    src={`http://localhost:5050${issue.issueImages[0]}`}
                                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" 
                                                                    alt="" 
                                                                    width={50}
                                                                    height={50}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                    <Icons.Report />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-700 text-sm">{issue.title}</p>
                                                            <p className="text-[10px] text-slate-400 font-mono">
                                                                {issue._id.slice(-8).toUpperCase()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-center">
                                                    <PriorityBadge priority={issue.priority} />
                                                </td>
                                                <td className="py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                    {issue.category}
                                                </td>
                                                <td className="py-4">
                                                    <StatusBadge status={issue.status} />
                                                </td>
                                                <td className="py-4 text-right">
                                                    <button 
                                                        onClick={() => router.push(`/user/reports/${issue._id}`)}
                                                        className="bg-slate-100 hover:bg-teal-600 hover:text-white p-2 rounded-lg transition-all"
                                                    >
                                                        <Icons.ChevronRight />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="py-12 text-center">
                                    <p className="text-slate-400 italic">
                                        No active issues assigned to you at the moment.
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Authority Info */}
                    <Card title="Your Assignment Info">
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold">Department</p>
                                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                                    {authorityStats.department || '—'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold">Employee ID</p>
                                <p className="text-sm font-mono text-slate-800 mt-0.5">
                                    {authorityStats.employeeId || '—'}
                                </p>
                            </div>
                            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold">Active</p>
                                    <p className="text-xl font-bold text-rose-600 mt-0.5">
                                        {authorityStats.assignedIssues}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold">Resolved</p>
                                    <p className="text-xl font-bold text-teal-600 mt-0.5">
                                        {authorityStats.completedIssues}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Performance */}
                    <Card title="Performance">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase">Resolution Rate</span>
                                <span className="text-sm font-black text-teal-600">
                                    {authorityStats.assignedIssues + authorityStats.completedIssues > 0
                                        ? `${Math.round((authorityStats.completedIssues / (authorityStats.assignedIssues + authorityStats.completedIssues)) * 100)}%`
                                        : '—'
                                    }
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase">Total Handled</span>
                                <span className="text-sm font-black text-slate-800">
                                    {authorityStats.completedIssues}
                                </span>
                            </div>
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Weekly Volume</p>
                                <div className="flex items-end space-x-1 h-12">
                                    {[30, 45, 25, 60, 80, 50, 40].map((h, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 bg-slate-100 rounded-t hover:bg-teal-400 transition-colors"
                                            style={{ height: `${h}%` }}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-between mt-1">
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                        <span key={i} className="flex-1 text-center text-[9px] text-slate-400">{d}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}