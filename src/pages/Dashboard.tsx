import React, { useState } from 'react';
import { User, FileText, Eye,  Clock, CheckCircle, XCircle, AlertCircle, ChevronDown, Image } from 'lucide-react';
import Header from '../components/Header';
import { useGetDashboardQuery, useGetRecentApplicationsQuery } from '../store/services/dashboardApi';
import { useNavigate } from 'react-router-dom';
import StatusModal from '../components/StatusModal';
import { toast } from 'react-toastify';
import { useUpdateApplicationMutation } from '../store/services/applicationApi';

const Dashboard: React.FC = () => {
    const { data: dashboardData, isLoading: isLoadingDashboard, error, refetch: refetchDash } = useGetDashboardQuery();
    const { data: applicationsData, isLoading: isLoadingApplication, refetch: refetchApp } = useGetRecentApplicationsQuery();
    const [updateApplication] = useUpdateApplicationMutation();
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [application, setApplication] = useState({});

    const dashboardState = dashboardData?.data;
    const applicationsState = applicationsData?.data;

    
    const navigate = useNavigate();

    const getStatusColor = (status: any): string => {
        switch (status) {
        case 'submitted': return 'bg-blue-100 text-blue-800';
        case 'under-review': return 'bg-yellow-100 text-yellow-800';
        case 'approved': return 'bg-green-100 text-green-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: any): string => {
        switch (status) {
        case 'submitted': return 'Submitted';
        case 'under-review': return 'Under Review';
        case 'approved': return 'Approved';
        case 'rejected': return 'Rejected';
        default: return status;
        }
    };

    const getStatusIcon = (status: any) => {
        switch (status) {
        case 'submitted': return <Clock className="w-4 h-4" />;
        case 'under-review': return <AlertCircle className="w-4 h-4" />;
        case 'approved': return <CheckCircle className="w-4 h-4" />;
        case 'rejected': return <XCircle className="w-4 h-4" />;
        default: return <Clock className="w-4 h-4" />;
        }
    };

    const formatDateTime = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            timeZone: 'Asia/Dhaka',
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const handleUpdateStatus = async (applicationId : string, updateData : { status: string; adminNotes?: string; rejectionReason?: string }) => {
        try {
            await updateApplication({
            id: applicationId,
            ...updateData,
            }).unwrap();
    
            toast.success(`Status updated to "${updateData.status.charAt(0).toUpperCase() + updateData.status.slice(1)}"`);
            await refetchApp();
            await refetchDash();
        } catch (err: any) {
            toast.error(`Failed to update status: ${err?.data?.message || err.message}`);
        }
    };

  
  return (
    <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-5 sm:mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{dashboardState?.totalApplications}</p>
                    </div>
                    <div className="bg-blue-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Submitted</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                        {dashboardState?.submittedCount}
                    </p>
                    </div>
                    <div className="bg-blue-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Under Review</p>
                    <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
                        {dashboardState?.underReviewCount}
                    </p>
                    </div>
                    <div className="bg-yellow-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                    </div>
                </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Approved</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">
                        {dashboardState?.approvedCount}
                    </p>
                    </div>
                    <div className="bg-green-100 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                </div>
                </div>
            </div>
            {/* Recent Applications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                </div>
                <div className="p-4 sm:p-6">
                <div className="space-y-4">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Applicant
                            </th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                Phone Number
                            </th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                Applied Date
                            </th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applicationsState?.map((app : any) => (
                                <tr key={app._id} className="hover:bg-gray-50 transition duration-200">
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="bg-indigo-100 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                                                {app.profileImage ? (
                                                    <img src={app.profileImage} alt="Applicant" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"/>
                                                ) : (
                                                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-sm font-medium text-left text-gray-900 truncate">{app.name}</div>
                                                <div className="text-sm text-gray-500 text-left truncate">{app.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap md:table-cell">
                                        <div className="text-sm text-gray-900 text-center">{app.phone}</div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap lg:table-cell">
                                        <div className="text-sm text-gray-900 text-center">{formatDateTime(app.submittedDate)}</div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <div className=" flex justify-center items-center">
                                            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)} flex items-center space-x-1 w-fit`}>
                                                {getStatusIcon(app.status)}
                                                <span className="hidden sm:inline">{getStatusText(app.status)}</span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex flex-col justify-end sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                                            <button
                                                onClick={() => navigate(`/admin/applications/${app._id}`)}
                                                className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200  p-1 rounded-md text-xs font-medium transition duration-200 flex items-center justify-center space-x-1"
                                            >
                                            <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setApplication(app)
                                                    setStatusModalOpen(!statusModalOpen)
                                                }}
                                                className={`p-1 rounded-md text-xs font-medium transition duration-200 flex items-center justify-center space-x-1 ${getStatusColor(app.status)}`}
                                            >
                                                {getStatusIcon(app.status)}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                </div>
            </div>
        </div>
        {/* Status Modal */}
        <StatusModal
            isOpen={statusModalOpen}
            onClose={() => setStatusModalOpen(false)}
            application={application}
            onUpdateStatus={handleUpdateStatus}
        />
    </div>
  );
};

export default Dashboard;