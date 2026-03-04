'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { handleGetIssueById, handleUpdateIssueStatusOnly, handleResolveIssue } from "@/lib/actions/issue-actions";
import { Card, Button, StatusBadge, Input } from "../../_components/Shared";
import { Icons, Issue } from "../../constants";
import ImageCarousel from "../../_components/ImageCarousel";

import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic import — same pattern as reportIssue page
const IssueMap = dynamic(() => import('../../_components/IssueMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-48 bg-slate-100 rounded-xl animate-pulse flex items-center justify-center">
            <p className="text-slate-400 text-xs">Loading map...</p>
        </div>
    ),
});

export default function Page() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user } = useAuth();

    const isAuthority = user?.role === 'authority';
    const isAdmin = user?.role === 'admin';

    const [issue, setIssue] = useState<Issue | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState('in-progress');
    const [remarks, setRemarks] = useState('');

    useEffect(() => {
        if (!id) return;
        const fetchIssue = async () => {
            setLoading(true);
            const res = await handleGetIssueById(id);
            if (res.success && res.data) {
                setIssue(res.data);
                setSelectedStatus(res.data.status);
            } else {
                setError(res.message || 'Failed to load issue');
            }
            setLoading(false);
        };
        fetchIssue();
    }, [id]);

    const handleStatusUpdate = async () => {
        if (!issue) return;
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        const res = selectedStatus === 'resolved'
            ? await handleResolveIssue(issue._id, remarks)
            : await handleUpdateIssueStatusOnly(issue._id, selectedStatus, remarks);

        if (res.success) {
            setSuccess('Issue updated successfully');
            const updated = await handleGetIssueById(issue._id);
            if (updated.success && updated.data) setIssue(updated.data);
            setRemarks('');
        } else {
            setError(res.message || 'Failed to update issue');
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
                <button
                    onClick={() => router.back()}
                    className="mt-4 text-teal-600 text-sm font-medium hover:underline"
                >
                    ← Go back
                </button>
            </div>
        );
    }
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
                <p className="text-slate-500 font-mono text-xs mt-1">{issue._id} • {issue.createdAt} • Reported by {issue.reportedBy.fullname}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                <Card>
                    {/* Image Carousel */}
                    {issue.issueImages && issue.issueImages.length > 0 ? (
                        <ImageCarousel images={issue.issueImages} />
                    ) : (
                        <div className="aspect-video bg-slate-100 rounded-xl mb-6 flex items-center justify-center gap-2 text-slate-300">
                            <Icons.Report />
                            <span className="text-sm">No photos attached</span>
                        </div>
                    )}
                    <div className="space-y-4">
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
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assignment Status</p>
                        <p className="text-sm font-bold text-slate-700 mt-1">
                            {issue.assignedTo?.fullname || <span className="text-rose-500">Unassigned</span>}
                        </p>
                        </div>
                    </div>
                    </div>
                </Card>

                {/* <Card title="Activity Log">
                    <div className="space-y-8 relative before:absolute before:inset-0 before:left-3 before:w-px before:bg-slate-200 before:z-0">
                    {issue.updates.length > 0 ? issue.updates.map((update: any, idx: number) => (
                        <div key={idx} className="relative z-10 flex space-x-6 items-start">
                        <div className={`w-6 h-6 rounded-full border-4 border-white shadow-sm flex-shrink-0 mt-1 ${
                            update.status === 'RESOLVED' ? 'bg-teal-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <div className="flex justify-between items-start">
                            <p className="text-sm font-bold text-slate-800">{update.comment}</p>
                            <span className="text-[9px] font-black text-slate-400 uppercase">{update.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 italic">Update by <span className="font-bold">{update.author}</span></p>
                        </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center py-8 text-slate-400 italic">
                            <Icons.Report />
                            <p className="mt-2 text-sm">Waiting for assignment and first update.</p>
                        </div>
                    )}
                    </div>
                </Card> */}
                </div>

                <div className="space-y-8">
                {/* {isSuperadmin && (
                    <Card title="Superadmin Controls" className="bg-slate-900 text-white border-none shadow-xl shadow-slate-200">
                    <div className="space-y-6">
                        <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Assign Task to Authority</label>
                        <select className="w-full bg-slate-800 border-none text-sm p-3 rounded-xl outline-none ring-1 ring-white/10 focus:ring-teal-500 transition-all">
                            <option>Select Authority User...</option>
                            {MOCK_AUTHORITIES.map(auth => (
                                <option key={auth.id} value={auth.id}>{auth.name} ({auth.department})</option>
                            ))}
                        </select>
                        </div>
                        <Input 
                        label="Assignment Directive" 
                        placeholder="Add specific instructions for the officer..." 
                        multiline 
                        className="!bg-slate-800 !text-white !border-none"
                        />
                        <div className="pt-4 border-t border-white/10">
                        <Button className="w-full !py-3">Confirm Assignment</Button>
                        <p className="text-[10px] text-slate-500 text-center mt-3 uppercase font-bold tracking-tighter">This will change status to IN_PROGRESS</p>
                        </div>
                    </div>
                    </Card>
                )} */}

                {isAuthority && (
                    <Card title="Update Work Progress">
                        <div className="space-y-5">

                            {/* Current status indicator */}
                            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <p className="text-xs text-slate-500 font-medium">Current status:</p>
                                <StatusBadge status={issue.status} />
                            </div>

                            {/* Status selector */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                    Update Status
                                </label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm p-3 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 transition-all"
                                >
                                    <option value="in-progress">Stay In Progress</option>
                                    <option value="resolved">Mark as Resolved</option>
                                    <option value="rejected">Mark as Rejected / Invalid</option>
                                </select>
                            </div>

                            {/* Remarks — required when resolving or rejecting */}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                                    Remarks{selectedStatus !== 'in-progress' && <span className="text-rose-400 ml-1">*</span>}
                                </label>
                                <textarea
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    rows={3}
                                    placeholder={
                                        selectedStatus === 'resolved'
                                            ? 'Describe what was done to resolve this issue...'
                                            : selectedStatus === 'rejected'
                                            ? 'Explain why this issue is being rejected...'
                                            : 'Optional notes...'
                                    }
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm p-3 rounded-xl outline-none focus:ring-2 focus:ring-teal-400 transition-all resize-none"
                                />
                            </div>

                            {/* Feedback */}
                            {error && (
                                <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                                    {error}
                                </p>
                            )}
                            {success && (
                                <p className="text-xs text-teal-600 bg-teal-50 border border-teal-100 px-3 py-2 rounded-lg">
                                    {success}
                                </p>
                            )}

                            <button
                                onClick={handleStatusUpdate}
                                disabled={
                                    submitting ||
                                    selectedStatus === issue.status ||
                                    (selectedStatus !== 'in-progress' && !remarks.trim())
                                }
                                className="w-full py-3 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-all"
                            >
                                {submitting
                                    ? 'Updating...'
                                    : selectedStatus === 'resolved'
                                    ? 'Mark as Resolved'
                                    : selectedStatus === 'rejected'
                                    ? 'Mark as Rejected'
                                    : 'Post Update'
                                }
                            </button>

                            {selectedStatus !== 'in-progress' && !remarks.trim() && (
                                <p className="text-[10px] text-slate-400 text-center">
                                    Remarks are required before submitting.
                                </p>
                            )}
                        </div>
                    </Card>
                )}

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