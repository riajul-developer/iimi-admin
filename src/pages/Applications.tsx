import React, { useState } from 'react';
import { User, Eye, Clock, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronLeft, ChevronRight, Search, Calendar, UserCheck } from 'lucide-react';
import Header from '../components/Header';
import { useGetApplicationsQuery, useUpdateApplicationMutation } from '../store/services/applicationApi';
import { useNavigate } from 'react-router-dom';
import StatusModal from '../components/StatusModal';
import { toast } from 'react-toastify';

const Applications: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [appliedFrom, setAppliedFrom] = useState('');
    const [appliedTo, setAppliedTo] = useState('');
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [application, setApplication] = useState({});

    const navigate = useNavigate();

    const { data: applicationsData, isLoading: isLoadingApplication, refetch } = useGetApplicationsQuery({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        status: statusFilter,
        appliedFrom,
        appliedTo,
    });
    const [updateApplication] = useUpdateApplicationMutation();

    const applicationsState = applicationsData?.data;
    const meta = applicationsData?.data?.meta;

    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'applied':
                return 'bg-blue-100 text-blue-800';
            case 'scheduled':
                return 'bg-purple-100 text-purple-800';
            case 'selected':
                return 'bg-green-100 text-green-800';
            case 'under-review':
                return 'bg-yellow-100 text-yellow-800';
            case 'submitted':
                return 'bg-indigo-100 text-indigo-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string): string => {
        switch (status) {
            case 'applied':
                return 'Applied';
            case 'scheduled':
                return 'Scheduled';
            case 'selected':
                return 'Selected';
            case 'under-review':
                return 'Under Review';
            case 'submitted':
                return 'Submitted';
            case 'rejected':
                return 'Rejected';
            default:
                return status;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'applied':
                return <Clock className="w-4 h-4" />;
            case 'scheduled':
                return <Calendar className="w-4 h-4" />;
            case 'selected':
                return <UserCheck className="w-4 h-4" />;
            case 'under-review':
                return <AlertCircle className="w-4 h-4" />;
            case 'submitted':
                return <Clock className="w-4 h-4" />;
            case 'rejected':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (limit: number) => {
        setItemsPerPage(limit);
        setCurrentPage(1);
    }

    const handleUpdateStatus = async (applicationId: string, updateData: { status: string; adminNotes?: string; rejectionReason?: string }) => {
        try {
            await updateApplication({
                id: applicationId,
                ...updateData,
            }).unwrap();

            toast.success(`Status updated to "${updateData.status.charAt(0).toUpperCase() + updateData.status.slice(1)}"`);
            await refetch();
        } catch (err: any) {
            toast.error(`Failed to update status: ${err?.data?.message || err.message}`);
        }
    };

    const getPageNumbers = () => {
        const totalPages = meta?.totalPages || 1;
        const currentPageNum = meta?.page || 1;
        const pages = [];

        // Show max 5 page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPageNum - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start page if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    if (isLoadingApplication) {
        return (
            <div className="min-h-screen bg-[#f2f2f2]">
                <Header />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="bg-white/50 rounded-xl shadow-sm border border-gray-200">
                        <div className="p-4 sm:p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
                        </div>
                        <div className="p-4 sm:p-6">
                            <div className="animate-pulse space-y-4">
                                {[...Array(5)].map((_, i: any) => (
                                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative">
            <Header />

            <div className="bg-overlay"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="bg-white/50 rounded-xl shadow-sm border border-gray-200">
                    <div className="p-4 sm:p-6 border-b border-gray-200">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            {/* Filters Section */}
                            <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-3 sm:items-center sm:space-x-3 w-full">

                                {/* Search Input */}
                                <div className="relative w-full sm:w-[280px]">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="w-4 h-4 text-gray-400" />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search by name, email or phone"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* Status Dropdown */}
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full sm:w-[150px] border border-gray-300 rounded-md px-3 py-2 text-sm"
                                >
                                    <option value="">All Status</option>
                                    <option value="applied">Applied</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="selected">Selected</option>
                                    <option value="under-review">Under Review</option>
                                    <option value="submitted">Submitted</option>
                                    <option value="rejected">Rejected</option>
                                </select>

                                {/* Date From */}
                                <input
                                    type="date"
                                    value={appliedFrom}
                                    onChange={(e) => {
                                        setAppliedFrom(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full sm:w-[170px] border border-gray-300 rounded-md px-3 py-2 text-sm"
                                />

                                {/* Date To */}
                                <input
                                    type="date"
                                    value={appliedTo}
                                    onChange={(e) => {
                                        setAppliedTo(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full sm:w-[170px] border border-gray-300 rounded-md px-3 py-2 text-sm"
                                />
                            </div>

                            {/* Items Per Page Section */}
                            <div className="flex items-center space-x-2 flex-wrap sm:flex-nowrap mt-2 sm:mt-0">
                                <span className="text-sm text-gray-500 whitespace-nowrap">Show</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                    className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                                <span className="text-sm text-gray-500 whitespace-nowrap">per page</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        <div className="space-y-4 overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Applicant
                                        </th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider  md:table-cell">
                                            Phone Number
                                        </th>
                                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider  lg:table-cell">
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
                                <tbody className="bg-white/40 divide-y divide-gray-200">
                                    {applicationsState?.applications?.map((app: any) => (
                                        <tr key={app._id} className="hover:bg-gray-50/70 transition duration-200">
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="bg-indigo-100 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                                                        {app.profileImage ? (
                                                            <img src={app.profileImage} alt="Applicant" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover" />
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
                                                        <span className=" sm:inline">{getStatusText(app.status)}</span>
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

                        {/* Pagination Component */}
                        {meta && meta.totalPages > 1 && (
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                {/* Results Info */}
                                <div className="text-sm text-gray-500">
                                    Showing {((meta.page - 1) * meta.limit) + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} results
                                </div>

                                {/* Pagination Controls */}
                                <div className="flex items-center space-x-2">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => handlePageChange(meta.page - 1)}
                                        disabled={!meta.hasPrevPage}
                                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${meta.hasPrevPage
                                            ? 'bg-white/50 text-gray-700 border border-gray-300 hover:bg-gray-50'
                                            : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                                            }`}
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Prev
                                    </button>

                                    {/* Page Numbers */}
                                    <div className="flex space-x-1">
                                        {getPageNumbers().map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${pageNum === meta.page
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-white/50 text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Next Button */}
                                    <button
                                        onClick={() => handlePageChange(meta.page + 1)}
                                        disabled={!meta.hasNextPage}
                                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${meta.hasNextPage
                                            ? 'bg-white/50 text-gray-700 border border-gray-300 hover:bg-gray-50'
                                            : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                                            }`}
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        )}
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

export default Applications;