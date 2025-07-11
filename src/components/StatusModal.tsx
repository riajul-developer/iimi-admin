import React, { useEffect, useState } from 'react';
import { X, Save, AlertCircle, CheckCircle, XCircle, FileText } from 'lucide-react';

// Application Status Enum
const ApplicationStatus = {
  UNDER_REVIEW: 'under-review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed'
};

const StatusModal = ({ 
  isOpen, 
  onClose, 
  application, 
  onUpdateStatus 
} : any) => {
  const [status, setStatus] = useState(application?.status);
  const [rejectionReason, setRejectionReason] = useState(application?.rejectionReason || '');
  const [adminNotes, setAdminNotes] = useState(application?.adminNotes || '');
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    { value: ApplicationStatus.UNDER_REVIEW, label: 'Under Review', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: AlertCircle },
    { value: ApplicationStatus.APPROVED, label: 'Approved', color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle },
    { value: ApplicationStatus.REJECTED, label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-300', icon: XCircle },
  ];

  useEffect(() => {
    if (application) {
      setStatus(application.status || '');
      setRejectionReason(application.rejectionReason || '');
      setAdminNotes(application.adminNotes || '');
    }
  }, [application]);

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const updateData = {
        status,
        adminNotes,
        ...(status === ApplicationStatus.REJECTED && rejectionReason && { rejectionReason })
      };
      
      await onUpdateStatus(application._id, updateData);
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (newStatus : any) => {
    setStatus(newStatus);
    if (newStatus !== ApplicationStatus.REJECTED) {
      setRejectionReason('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Update Application Status</h2>
                        <p className="text-sm text-gray-500">Application ID: {application?._id}</p>
                    </div>
                    </div>
                    <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                    <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>
            {/* Form */}
            <div className="p-6 space-y-6">
            {/* Status Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                Application Status *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {statusOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => handleStatusChange(option.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        status === option.value
                            ? `${option.color} border-current scale-105 shadow-lg`
                            : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                    >
                        <div className="flex items-center space-x-3">
                        <IconComponent className={`w-5 h-5 ${
                            status === option.value ? 'text-current' : 'text-gray-400'
                        }`} />
                        <span className={`font-medium ${
                            status === option.value ? 'text-current' : 'text-gray-700'
                        }`}>
                            {option.label}
                        </span>
                        </div>
                    </button>
                    );
                })}
                </div>
            </div>

            {/* Rejection Reason - Only show if status is rejected */}
            {status === ApplicationStatus.REJECTED && (
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason *
                </label>
                <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                    placeholder="Please provide a reason for rejection..."
                    required={status === ApplicationStatus.REJECTED}
                />
                </div>
            )}

            {/* Admin Notes */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes (Optional)
                </label>
                <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Add any internal notes about this application..."
                />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                Cancel
                </button>
                <button
                onClick={handleSubmit}
                disabled={isLoading || (status === ApplicationStatus.REJECTED && !rejectionReason.trim())}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                >
                {isLoading ? (
                    <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                    </>
                ) : (
                    <>
                    <Save className="w-4 h-4" />
                    <span>Update Status</span>
                    </>
                )}
                </button>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;