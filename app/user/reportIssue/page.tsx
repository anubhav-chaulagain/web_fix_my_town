'use client'

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { handleCreateUser } from "@/lib/actions/admin/user-action";
import { toast } from "react-toastify";
import { ReportIssueForm, reportIssueSchema } from "./schema";
import { Button, Card } from "../_components/Shared";
import { Icons } from "../constants";
import Image from "next/image";
import { X, MapPin } from "lucide-react";
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";
import { handleCreateIssue } from "@/lib/actions/issue-actions";

// Dynamic import to avoid SSR issues with Leaflet
const MapPicker = dynamic(() => import('../_components/MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-100 bg-slate-100 rounded-lg animate-pulse flex items-center justify-center">
      <p className="text-slate-500">Loading map...</p>
    </div>
  ),
});

export default function SignupPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [showMap, setShowMap] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const {register, handleSubmit, control, reset, setValue, watch, formState:{errors}} = useForm<ReportIssueForm>({
        resolver: zodResolver(reportIssueSchema)
    });

    const locationValue = watch("location");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        const totalFiles = selectedFiles.length + newFiles.length;

        if (totalFiles > 5) {
            toast.error('You can only upload up to 5 images');
            return;
        }

        const newPreviewUrls: string[] = [];
        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviewUrls.push(reader.result as string);
                if (newPreviewUrls.length === newFiles.length) {
                    setPreviewImages(prev => [...prev, ...newPreviewUrls]);
                }
            };
            reader.readAsDataURL(file);
        });

        setSelectedFiles(prev => [...prev, ...newFiles]);
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveImage = (index: number) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleDismissAllImages = () => {
        setPreviewImages([]);
        setSelectedFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleLocationSelect = (lat: number, lng: number, address: string) => {
        setCoordinates({ lat, lng });
        setValue("location", address);
        toast.success('Location selected on map');
    };

    const onSubmit = async (data: ReportIssueForm) => {
        event?.preventDefault();
        try {
            const formData = new FormData();
            
            // Required fields
            formData.append('title', data.title);
            formData.append('category', data.category);
            formData.append('location', data.location);
            formData.append('description', data.description);

            // Optional: Coordinates if selected from map
            if (coordinates) {
                formData.append('latitude', coordinates.lat.toString());
                formData.append('longitude', coordinates.lng.toString());
            }

            // Optional: Multiple images (max 5)
            selectedFiles.forEach((file) => {
                formData.append('issueImages', file);
            });

            // Call the server action (this should call your backend API)
            const response = await handleCreateIssue(formData);

            if (!response.success) {
                throw new Error(response.message || 'Failed to report issue');
            }

            reset();
            handleDismissAllImages();
            setCoordinates(null);
            setShowMap(false);
            toast.success(response.message || 'Issue reported successfully');
            router.push('/user/reports');

        } catch (error: Error | any) {
            toast.error(error.message || 'Failed to report issue');
        }
    }

    return (
        <section className="space-y-8 mx-auto mt-8 mb-16 ml-40">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Report New Issue</h2>
                <p className="text-slate-500 mt-1">Help us improve the town by providing detailed information about the problem.</p>
            </div>
        
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
                    <Card>
                        <div className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Title</label>
                                <input 
                                    placeholder="e.g. Large pothole blocking lane" 
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-700" 
                                    {...register("title")}
                                />
                                <p className="error-text">{errors.title?.message}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Category</label>
                                    <select 
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-700" 
                                        {...register("category")}
                                    >
                                        <option value="Pothole">Pothole</option>
                                        <option value="Broken Streetlight">Broken Streetlight</option>
                                        <option value="Garbage">Garbage</option>
                                        <option value="Water Leakage">Water Leakage</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <p className="error-text">{errors.category?.message}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Location</label>
                                    <div className="relative">
                                        <input 
                                            placeholder="Enter address or select on map" 
                                            className="w-full px-4 py-2 pr-10 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-700" 
                                            {...register("location")}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowMap(!showMap)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-teal-600 hover:text-teal-700 transition-colors"
                                        >
                                            <MapPin size={20} />
                                        </button>
                                    </div>
                                    {coordinates && (
                                        <p className="text-xs text-teal-600 flex items-center gap-1">
                                            <MapPin size={12} />
                                            Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                                        </p>
                                    )}
                                    <p className="error-text">{errors.location?.message}</p>
                                </div>
                            </div>

                            {/* Map Picker */}
                            {showMap && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-slate-700">
                                            Select Location on Map
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setShowMap(false)}
                                            className="text-sm text-slate-500 hover:text-slate-700"
                                        >
                                            Hide Map
                                        </button>
                                    </div>
                                    <MapPicker
                                        onLocationSelect={handleLocationSelect}
                                        initialPosition={coordinates ? [coordinates.lat, coordinates.lng] : [27.7172, 85.3240]}
                                    />
                                    <p className="text-xs text-slate-500">Click anywhere on the map to select a location</p>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Description</label>
                                <textarea 
                                    placeholder="Describe the issue in detail..." 
                                    rows={4} 
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-700" 
                                    {...register("description")}
                                />
                                <p className="error-text">{errors.description?.message}</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">
                                    Upload Images 
                                    <span className="text-slate-400 font-normal ml-2">
                                        ({selectedFiles.length}/5)
                                    </span>
                                </label>
                                
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center space-y-2 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
                                >
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 group-hover:text-teal-600 shadow-sm">
                                        <Icons.Report />
                                    </div>
                                    <p className="text-sm font-medium text-slate-600">Click to upload or drag and drop</p>
                                    <p className="text-xs text-slate-400">PNG, JPG, or GIF (max. 10MB per file, up to 5 files)</p>
                                </div>
                                
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                
                                {previewImages.length > 0 && (
                                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {previewImages.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <div className="aspect-square relative rounded-lg overflow-hidden border-2 border-slate-200">
                                                    <Image
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                <p className="error-text">{errors.issueImages?.message}</p>
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end space-x-4">
                        <Button variant="outline" type="button" onClick={() => {
                            reset();
                            handleDismissAllImages();
                            setCoordinates(null);
                            setShowMap(false);                           
                        }}>Cancel</Button>
                        <button 
                            className="px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 text-sm text-white bg-[#1EA095]" 
                            type="submit"
                        >
                            Report Issue
                        </button>
                    </div>
                </form>

                <div className="space-y-6">
                    <div className="bg-teal-900 text-white border-none shadow-teal-900/20 rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                            <span className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center text-xs">?</span>
                            <span>Pro Tips for Reporting</span>
                        </h3>
                        <ul className="space-y-4 text-sm text-teal-100">
                            <li className="flex items-start space-x-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                                <span>Be specific about the location. Use landmarks if an exact address is unknown.</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                                <span>Clear photos help our maintenance crew identify the scope of the problem.</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                                <span>Report during daylight if possible for better visibility in photos.</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                                <span>Use the map picker for precise location accuracy.</span>
                            </li>
                        </ul>
                    </div>

                    <Card title="Help Desk">
                        <p className="text-sm text-slate-600 mb-4">Need help with the reporting process or having technical issues?</p>
                        <div className="space-y-3">
                            <button className="w-full text-left px-4 py-2 text-sm border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between">
                                <span>View FAQ</span>
                                <Icons.ChevronRight />
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between">
                                <span>Call Hotline</span>
                                <span className="text-teal-600 font-bold">1-800-FIX-TOWN</span>
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}