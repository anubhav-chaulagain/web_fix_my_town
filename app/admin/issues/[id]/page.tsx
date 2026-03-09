'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    handleGetIssueById,
    handleAssignIssue,
    handleResolveIssue,
    handleUpdateIssueStatusOnly,
} from "@/lib/actions/issue-actions";
import { Icons, Issue } from "../../../user/constants";
import ImageCarousel from "../../../user/_components/ImageCarousel";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { handleGetAuthorityUsers } from "@/lib/actions/admin/user-action";
import { Card, StatusBadge } from "@/app/user/_components/Shared";

const IssueMap = dynamic(() => import('../../../user/_components/IssueMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-48 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center">
            <p className="text-slate-400 text-xs">Loading map...</p>
        </div>
    ),
});

interface AuthorityUser {
    _id: string;
    fullname: string;
    email: string;
    role: string;
    department: string;
}



export default function AdminIssueDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [issue, setIssue] = useState<Issue | null>(null);
    const [authorities, setAuthorities] = useState<AuthorityUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    // Assignment form state
    const [selectedAuthority, setSelectedAuthority] = useState('');

    // Status update form state
    const [selectedStatus, setSelectedStatus] = useState('');
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            setLoading(true);
            const [issueRes, authRes] = await Promise.all([
                handleGetIssueById(id),
                handleGetAuthorityUsers(),
            ]);
            if (issueRes.success && issueRes.data) {
                setIssue(issueRes.data);
                setSelectedStatus(issueRes.data.status);
            } else {
                setError(issueRes.message || 'Failed to load issue');
            }
            if (authRes.success && authRes.data) {
                setAuthorities(authRes.data);
            }
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const refreshIssue = async () => {
        const res = await handleGetIssueById(id);
        if (res.success && res.data) {
            setIssue(res.data);
            setSelectedStatus(res.data.status);
        }
    };

    const handleAssign = async () => {
        if (!issue || !selectedAuthority) return;
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        const res = await handleAssignIssue(issue._id, selectedAuthority);
        if (res.success) {
            setSuccess('Issue assigned successfully.');
            setSelectedAuthority('');
            await refreshIssue();
        } else {
            setError(res.message || 'Failed to assign issue.');
        }
        setSubmitting(false);
    };

    const handleStatusUpdate = async () => {
        if (!issue) return;
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        const res = selectedStatus === 'resolved'
            ? await handleResolveIssue(issue._id, remarks)
            : await handleUpdateIssueStatusOnly(issue._id, selectedStatus, remarks);

        if (res.success) {
            setSuccess('Status updated successfully.');
            setRemarks('');
            await refreshIssue();
        } else {
            setError(res.message || 'Failed to update status.');
        }
        setSubmitting(false);
    };

    if (loading) {
        return (
            <div className="mt-8 mb-16 ml-40 space-y-6 animate-pulse">
                <div className="h-8 bg-slate-200 rounded w-1/2" />
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 h-96 bg-slate-100 rounded-xl" />
                    <div className="h-96 bg-slate-100 rounded-xl" />
                </div>
            </div>
        );
    }

    if (!issue) {
        return (
            <div className="mt-8 mb-16 ml-40 text-center py-24">
                <p className="text-slate-500 text-sm">{error || 'Issue not found.'}</p>
                <button onClick={() => router.back()} className="mt-4 text-teal-600 text-sm font-medium hover:underline">
                    ← Go back
                </button>
            </div>
        );
    }

    const isAssigned = !!issue.assignedTo;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 mt-8 mb-16 ml-40">

            <div className="flex items-center space-x-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <div>
                    <div className="flex items-center space-x-3">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{issue.title}</h2>
                        <StatusBadge status={issue.status} />
                    </div>
                    <p className="text-slate-500 font-mono text-xs mt-1">
                        {issue._id} • {new Date(issue.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • Reported by {issue.reportedBy?.fullname}
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-teal-50 border border-teal-200 text-teal-700 text-sm px-4 py-3 rounded-xl">
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        {issue.issueImages && issue.issueImages.length > 0 ? (
                            <ImageCarousel images={issue.issueImages} />
                        ) : (
                            <div className="aspect-video bg-slate-100 rounded-xl mb-6 flex items-center justify-center gap-2 text-slate-300">
                                <Icons.Report />
                                <span className="text-sm">No photos attached</span>
                            </div>
                        )}

                        <div className="space-y-4 mt-4">
                            <h4 className="text-lg font-black text-slate-800">Issue Details</h4>
                            <p className="text-slate-600 leading-relaxed font-medium">{issue.description}</p>

                            <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-8">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</p>
                                    <p className="text-sm font-bold text-slate-700 mt-1">{issue.category}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                                    <p className="text-sm font-bold text-slate-700 mt-1">{issue.location}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned To</p>
                                    <p className="text-sm font-bold mt-1">
                                        {isAssigned
                                            ? <span className="text-teal-700">{issue.assignedTo?.fullname}</span>
                                            : <span className="text-rose-500">Unassigned</span>
                                        }
                                    </p>
                                </div>
                                {issue.remarks && (
                                    <div className="w-full">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Remarks</p>
                                        <p className="text-sm text-slate-600 mt-1 italic">&quot;{issue.remarks}&quot;</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">

                    <div className="bg-slate-900 text-white rounded-xl p-5 space-y-5">
                        <h3 className="font-bold text-sm flex items-center gap-2">
                            <span className="w-5 h-5 bg-teal-500 rounded flex items-center justify-center text-xs">
                                <Icons.Report />
                            </span>
                            {isAssigned ? 'Reassign Issue' : 'Assign Issue'}
                        </h3>

                        {isAssigned && (
                            <div className="bg-teal-900/50 border border-teal-700 rounded-lg px-3 py-2 text-xs text-teal-200">
                                Currently assigned to <span className="font-bold text-white">{issue.assignedTo?.fullname}</span>
                            </div>
                        )}

                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                Select Authority Officer
                            </label>
                            <select
                                value={selectedAuthority}
                                onChange={(e) => setSelectedAuthority(e.target.value)}
                                className="w-full bg-slate-800 text-white text-sm p-3 rounded-xl outline-none ring-1 ring-white/10 focus:ring-teal-500 transition-all"
                            >
                                <option value="">Choose an officer...</option>
                                {authorities.map((auth) => (
                                    <option key={auth._id} value={auth._id}>
                                        {auth.fullname} — {auth.department}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-2 border-t border-white/10">
                            <button
                                onClick={handleAssign}
                                disabled={!selectedAuthority || submitting}
                                className="w-full py-3 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all"
                            >
                                {submitting ? 'Assigning...' : isAssigned ? 'Reassign Issue' : 'Confirm Assignment'}
                            </button>
                            <p className="text-[10px] text-slate-500 text-center mt-2 uppercase font-bold tracking-tighter">
                                This will set status to IN-PROGRESS
                            </p>
                        </div>
                    </div>

                    <Card title="Override Status">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                    New Status
                                </label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm p-3 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 transition-all"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                    Remarks (optional)
                                </label>
                                <textarea
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    rows={3}
                                    placeholder="Add a note about this status change..."
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm p-3 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 transition-all resize-none"
                                />
                            </div>
                            <button
                                onClick={handleStatusUpdate}
                                disabled={submitting || selectedStatus === issue.status}
                                className="w-full py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all"
                            >
                                {submitting ? 'Updating...' : 'Update Status'}
                            </button>
                        </div>
                    </Card>

                    {issue.latitude && issue.longitude ? (
                        <Card title="Issue Location">
                            <IssueMap lat={issue.latitude} lng={issue.longitude} />
                            <div className="mt-3 flex items-start gap-2">
                                <MapPin size={14} className="text-teal-600 mt-0.5 shrink-0" />
                                <p className="text-xs text-slate-500 leading-relaxed">{issue.location}</p>
                            </div>
                            <div className="mt-2 flex gap-2 text-[10px] text-slate-400 font-mono">
                                <span>{issue.latitude.toFixed(6)}</span>
                                <span>,</span>
                                <span>{issue.longitude.toFixed(6)}</span>
                            </div>
                        </Card>
                    ) : (
                        <Card title="Issue Location">
                            <div className="h-40 bg-slate-100 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400">
                                <MapPin size={20} />
                                <p className="text-xs">No coordinates provided</p>
                                {issue.location && (
                                    <p className="text-xs text-slate-500 text-center px-4">{issue.location}</p>
                                )}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}