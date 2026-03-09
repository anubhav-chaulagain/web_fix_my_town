import { useAuth } from "@/app/context/AuthContext";
import { handleGetUnassignedIssues } from "@/lib/actions/issue-actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icons, IssueStatus } from "../../user/constants";
import { Button, Card, StatusBadge } from "../../user/_components/Shared";
import Image from "next/image";
import { handleFetchAdminStats } from "@/lib/actions/admin/user-action";

interface UnassignedIssue {
    _id: string;
    title: string;
    category: string;
    status: IssueStatus;
    issueImages?: string[];
}


export function AdminDashboard() {
    const router = useRouter();
    const { user } = useAuth();

    const [reportStats, setReportStats] = useState({
        totalReports: 0,
        pendingReports: 0,
        resolvedReports: 0,
        inprogressReports: 0,
        unassignedReports: 0,
    });
    const [unassignedIssues, setUnassignedIssues] = useState<UnassignedIssue[]>([]);
    console.log('Report Stats:', reportStats);
    useEffect(() => {
        handleFetchAdminStats().then((res) => {
            if (res.success && res.data) setReportStats(res.data);
        });
        handleGetUnassignedIssues(5).then((res) => {
            if (res.success && res.data) setUnassignedIssues(res.data);
        });
    }, []);

    const stats = [
        { label: 'Total Reports',   value: reportStats.totalReports,      color: 'text-blue-600',  bg: 'bg-blue-50',  icon: Icons.Report },
        { label: 'Unassigned',      value: reportStats.unassignedReports, color: 'text-red-500',   bg: 'bg-red-50',   icon: Icons.Report },
        { label: 'Pending',         value: reportStats.pendingReports,    color: 'text-amber-600', bg: 'bg-amber-50', icon: Icons.Map },
        { label: 'In Progress',     value: reportStats.inprogressReports, color: 'text-blue-500',  bg: 'bg-blue-50',  icon: Icons.Report },
        { label: 'Resolved',        value: reportStats.resolvedReports,   color: 'text-teal-600',  bg: 'bg-teal-50',  icon: Icons.ChevronRight },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 mt-8 mb-16 ml-40">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">
                        Welcome back, {user?.fullname?.split(' ')[0]}
                    </h2>
                    <p className="text-slate-500 mt-1">
                        Here is what needs your attention today.
                    </p>
                </div>
                <Button onClick={() => router.push('/admin/issues')} className="flex items-center space-x-2">
                    <Icons.Report />
                    <span>View All Issues</span>
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
                    <Card title="Assignment Queue (Unassigned)">
                        {unassignedIssues.length === 0 ? (
                            <div className="py-12 text-center text-slate-400">
                                <p className="text-sm">No unassigned issues. All caught up! 🎉</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                            <th className="pb-4">Report</th>
                                            <th className="pb-4">Category</th>
                                            <th className="pb-4">Status</th>
                                            <th className="pb-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {unassignedIssues.map((issue) => (
                                            <tr
                                                key={issue._id}
                                                className="hover:bg-slate-50 transition-colors group"
                                            >
                                                <td className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        {issue.issueImages?.[0] ? (
                                                            <Image
                                                                src={`http://localhost:5050${issue.issueImages[0]}`}
                                                                alt={issue.title}
                                                                className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200"
                                                                width={40}
                                                                height={40}
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                                                                <Icons.Report />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-semibold text-slate-700 text-sm leading-tight">
                                                                {issue.title}
                                                            </p>
                                                            <p className="text-xs text-slate-400 font-mono mt-0.5">
                                                                REP-{issue._id.slice(-4).toUpperCase()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-4 text-sm font-medium text-slate-600 uppercase tracking-wide">
                                                    {issue.category}
                                                </td>

                                                <td className="py-4">
                                                    <StatusBadge status={issue.status} />
                                                </td>

                                                <td className="flex justify-end py-4">
                                                    <button
                                                        onClick={() => router.push(`/admin/issues/${issue._id}`)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 transition-all"
                                                    >
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
                                onClick={() => router.push('/admin/issues?status=unassigned')}
                                className="text-sm text-teal-600 font-medium hover:underline"
                            >
                                View all unassigned →
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
                                    onClick={() => router.push('/admin/issues')}
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
                            Admin Tips
                        </h3>
                        <ul className="space-y-2 text-xs text-teal-100">
                            <li className="flex items-start gap-2">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                                Assign critical issues first to reduce risk.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                                Use the map to spot clusters of nearby reports.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                                Add remarks when resolving for a clear audit trail.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}