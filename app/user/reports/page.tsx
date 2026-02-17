"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button, Card, Input, StatusBadge } from "../_components/Shared";
import { Icons } from "../constants";
import Image from "next/image";
import { IssueStatus } from "@/lib/types/issue.type";
import { handleGetAllIssues } from "@/lib/actions/issue-actions";

interface Issue {
    _id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    status: IssueStatus;
    createdAt: string;
    issueImages?: string[];
    reportedBy: {
        _id: string;
        fullname: string;
        email: string;
    };
}

export default function Page() {
    const router = useRouter();
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const size = 3;

    console.log(issues);

    const fetchIssues = async () => {
        setLoading(true);
        try {
            const response = await handleGetAllIssues({
                page,
                size: size.toString(),
                status: statusFilter || undefined,
                category: categoryFilter || undefined,
                search: search || undefined,
            });
            if (response.success && response.data) {
                setIssues(response.data);
                setTotalPages(response.pagination?.totalPages || 1);
                setTotal(response.pagination?.totalItems || 0);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIssues();
    }, [page, statusFilter, categoryFilter]);

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') fetchIssues();
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 mt-8 mb-16 ml-40">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">My Reports</h2>
                    <p className="text-slate-500 mt-1">Review and track all your reported issues.</p>
                </div>
                <div className="flex space-x-3">
                    <Button 
                        variant="outline" 
                        type="button"
                        onClick={() => router.push('/user/reportIssue')}
                    >
                        <span>New Report</span>
                    </Button>
                </div>
            </div>

            <Card>
                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div className="flex-1 max-w-md">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Search Reports</label>
                            <input
                                placeholder="Search by title or location..."
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-700"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Status</label>
                            <select
                                className="w-40 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-700"
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Category</label>
                            <select
                                className="w-40 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-700"
                                value={categoryFilter}
                                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                            >
                                <option value="">All Categories</option>
                                <option value="Pothole">Pothole</option>
                                <option value="Broken Streetlight">Broken Streetlight</option>
                                <option value="Garbage">Garbage</option>
                                <option value="Water Leakage">Water Leakage</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                <th className="pb-4 pl-4">ID</th>
                                <th className="pb-4">Issue Details</th>
                                <th className="pb-4">Location</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4">Created</th>
                                <th className="pb-4 text-right pr-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        Loading...
                                    </td>
                                </tr>
                            ) : issues.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        No reports found
                                    </td>
                                </tr>
                            ) : (
                                issues.map((issue) => (
                                    <tr key={issue._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4 pl-4 font-mono text-xs text-slate-400">
                                            {issue._id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                                                    {issue.issueImages?.[0] ? (
                                                        <Image 
                                                            src={`http://localhost:5050${issue.issueImages[0]}`}
                                                            width={50} 
                                                            height={50} 
                                                            className="w-full h-full object-cover" 
                                                            alt="Issue Image" 
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            <Icons.Report />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-700 text-sm">{issue.title}</p>
                                                    <p className="text-xs text-slate-500">{issue.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm text-slate-500 max-w-[200px] truncate">
                                            {issue.location}
                                        </td>
                                        <td className="py-4">
                                            <StatusBadge status={issue.status} />
                                        </td>
                                        <td className="py-4 text-sm text-slate-400">
                                            {new Date(issue.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="py-4 text-right pr-4">
                                            <Button
                                                variant="outline"
                                                type="button"
                                                onClick={() => router.push(`/user/reports/${issue._id}`)}
                                            >
                                                Details
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Showing {issues.length} of {total} reports
                    </p>
                    <div className="flex space-x-2">
                        <Button 
                            variant="outline" 
                            type="button"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                        >
                            Previous
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <Button
                                key={p}
                                type="button"
                                variant="outline"
                                onClick={() => setPage(p)}
                            >
                                {p}
                            </Button>
                        ))}
                        <Button 
                            variant="outline" 
                            type="button"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}