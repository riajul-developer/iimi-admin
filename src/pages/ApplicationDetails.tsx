import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  FileText,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  Briefcase,
  Eye,
  Heart,
  Loader2,
  IdCard,
  Info,
  FileUser,
  File,
  FileSpreadsheet,
} from 'lucide-react';
import { useGetApplicationByIdQuery, useUpdateApplicationMutation } from '../store/services/applicationApi';
import StatusModal from '../components/StatusModal';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const ApplicationDetails = () => {
  const { id } = useParams();
  const { data, isLoading, error, refetch  } = useGetApplicationByIdQuery(id!);
  const [updateApplication] = useUpdateApplicationMutation();
  const [activeTab, setActiveTab] = useState('first-phase');
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const navigate = useNavigate();
  
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'under-review':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'approved':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'pending':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return <Clock className="w-4 h-4" />;
      case 'under-review':
        return <AlertCircle className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to calculate age
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Handle document download
  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  const handleUpdateStatus = async (applicationId : string, updateData : { status: string; adminNotes?: string; rejectionReason?: string }) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Failed to load application details</p>
        </div>
      </div>
    );
  }

  const application = data.data.application;
  const profile = data.data.profile;


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 px-6 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:scale-105">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Previous Page</span>
          </button>
          {/* Tabs */}
          <div className=" flex items-center justify-end">
              <div className="flex space-x-4">
                <button
                  onClick={() => setStatusModalOpen(!statusModalOpen)}
                  className={`px-6 py-3 rounded-[12px] border-2 ${getStatusColor(application.status)} flex items-center space-x-3 shadow-lg`}
                >
                  {getStatusIcon(application.status)}
                  <span className="font-bold capitalize text-sm tracking-wide">
                    {application.status.replace('-', ' ')}
                  </span>
                </button>
                {[{ id: 'first-phase', label: '1st Phase', icon: FileText }, { id: 'second-phase', label: '2nd Phase', icon: FileText }].map(tab => (
                    <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap ${
                        activeTab === tab.id
                        ? 'bg-gradient-to-r from-red-400 to-red-600 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-gray-900 bg-gray-200'
                    }`}
                    >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    </button>
                ))}
              </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-[12px] shadow-xl border border-white/20 overflow-hidden sticky top-20">
              {/* Profile Header */}
              <div className="relative bg-gradient-to-r from-red-400 to-red-600 p-8 text-center">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <div className="w-28 h-28 rounded-3xl bg-white/20 backdrop-blur-sm mx-auto mb-4 overflow-hidden border-4 border-white/30 shadow-2xl">
                    {profile?.basic?.profilePicFile?.url && (
                      <img 
                        src={profile.basic.profilePicFile.url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {profile?.basic?.fullName || 'N/A'}
                  </h2>
                  <p className="text-blue-100 text-sm font-semibold mb-1">
                    #{application?._id?.slice(-8)}
                  </p>
                  <p className="text-blue-200 text-sm">Job Applicant</p>
                </div>
              </div>

              {/* Basic Info */}
              <div className="p-6 space-y-4">
                {profile?.basic?.email && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-900 font-medium">{profile.basic.email}</span>
                  </div>
                )}

                {profile?.basic?.phone && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-900 font-medium">{profile.basic.phone}</span>
                  </div>
                )}

                {profile?.address?.present && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-gray-900 font-medium">
                      {[profile.address.present.street, profile.address.present.upazila, profile.address.present.district].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}

                {profile?.other?.gender && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
                      <User className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-gray-900 font-medium capitalize">{profile.other.gender}</span>
                  </div>
                )}

                {profile?.basic?.dateOfBirth && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-gray-900 font-medium">
                      {calculateAge(profile.basic.dateOfBirth)} years old
                    </span>
                  </div>
                )}

                {profile?.other?.maritalStatus && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-teal-100 rounded-xl flex items-center justify-center">
                      <Heart className="w-4 h-4 text-teal-600" />
                    </div>
                    <span className="text-gray-900 font-medium capitalize">{profile.other.maritalStatus}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="min-h-screen w-full">
            {/* Content */}
            {activeTab === 'first-phase' && (
              <div className="w-full">
                {/* Identity */}
                <div className="bg-white/90 backdrop-blur-sm rounded-t-[12px] shadow-xl border border-white/20 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center">
                      <IdCard className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Identity Documents</h3>
                  </div>
                  <div className="p-8 space-y-6">
                    {/* Identity Files */}
                    <div>
                      {profile?.identity?.number && (
                        <h4 className="text-sm font-bold mb-4 text-gray-500 block uppercase tracking-wide">
                          Identity Number : <span className="text-lg text-gray-900">{profile.identity.number}</span>
                        </h4>
                      )}
                      {profile?.identity?.docFiles && profile.identity.docFiles.length > 0 ? (
                        <div className={`grid grid-cols-1 ${profile.identity.docFiles.length > 1 && 'md:grid-cols-2'} gap-4`}>
                          {profile.identity.docFiles.map((doc: any, index: number) => {
                            // Determine title based on doc type
                            let label = '';
                            if (doc.type === 'nid') {
                              label = `NID (${doc.side})`;
                            } else if (doc.type === 'passport') {
                              label = `Passport (${doc.side})`;
                            } else if (doc.type === 'birthReg') {
                              label = 'Birth Registration';
                            }

                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 hover:shadow-lg transition-all duration-200"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900">{label}</p>
                                    <p className="text-sm text-gray-500 line-clamp-1 font-semibold">{doc.name}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => window.open(doc.url, '_blank')}
                                  className="p-2 flex space-x-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 hover:scale-110"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500 text-lg font-medium">No identity documents found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Emergency Contact */}
                <div className="bg-white/90 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden">
                  <div className="p-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 flex items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Emergency Contact</h3>
                    </div>
                  </div>
                  <div className="p-8">
                    {profile?.emergencyContact?.name || profile?.emergencyContact?.phone ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {profile.emergencyContact.name && (
                          <div>
                            <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Full Name</label>
                            <p className="text-gray-900 font-semibold text-lg">{profile.emergencyContact.name}</p>
                          </div>
                        )}
                        {profile.emergencyContact.phone && (
                          <div>
                            <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Phone</label>
                            <p className="text-gray-900 font-semibold text-lg">{profile.emergencyContact.phone}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-lg font-medium">No emergency contact found</p>
                      </div>
                    )}
                  </div>
                </div>
                {/* Address Info */}
                <div className="bg-white/90 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden">
                  <div className="p-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 flex items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Address Information</h3>
                    </div>
                  </div>
                  <div className="p-8">
                    {(profile?.address?.present && (profile.address.present.street || profile.address.present.upazila || profile.address.present.district)) || 
                    (profile?.address?.permanent && (profile.address.permanent.street || profile.address.permanent.upazila || profile.address.permanent.district)) ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {/* Present Address */}
                        {profile?.address?.present && (profile.address.present.street || profile.address.present.upazila || profile.address.present.district) && (
                          <div>
                            <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Present Address</label>
                            <p className="text-gray-900 font-semibold text-lg">
                              {[profile.address.present.street, profile.address.present.upazila, profile.address.present.district].filter(Boolean).join(', ')}
                            </p>
                          </div>
                        )}
                        {/* Permanent Address */}
                        {profile?.address?.permanent && (profile.address.permanent.street || profile.address.permanent.upazila || profile.address.permanent.district) && (
                          <div>
                            <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Permanent Address</label>
                            <p className="text-gray-900 font-semibold text-lg">
                              {[profile.address.permanent.street, profile.address.permanent.upazila, profile.address.permanent.district].filter(Boolean).join(', ')}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-lg font-medium">No address information found</p>
                      </div>
                    )}
                  </div>
                </div>
                {/* Other Information */}
                <div className="bg-white/90 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden">
                  <div className="p-6 py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50 flex items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center">
                        <Info className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Other Information</h3>
                    </div>
                  </div>
                  <div className="p-8">
                    {profile?.other && (profile.other.fathersName || profile.other.mothersName || profile.other.religion || profile.other.gender || profile.other.maritalStatus) ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                        {profile.other.fathersName && (
                          <div>
                            <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Father's Name</label>
                            <p className="text-gray-900 font-semibold text-lg">{profile.other.fathersName}</p>
                          </div>
                        )}
                        {profile.other.mothersName && (
                          <div>
                            <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Mother's Name</label>
                            <p className="text-gray-900 font-semibold text-lg">{profile.other.mothersName}</p>
                          </div>
                        )}
                        {profile.other.religion && (
                          <div>
                            <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Religion</label>
                            <p className="text-gray-900 font-semibold text-lg">{profile.other.religion}</p>
                          </div>
                        )}
                        {profile.other.gender && (
                          <div>
                            <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Gender</label>
                            <p className="text-gray-900 font-semibold text-lg capitalize">{profile.other.gender}</p>
                          </div>
                        )}
                        {profile.other.maritalStatus && (
                          <div>
                            <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Marital Status</label>
                            <p className="text-gray-900 font-semibold text-lg capitalize">{profile.other.maritalStatus}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-lg font-medium">No other information found</p>
                      </div>
                    )}
                  </div>
                </div>
                {/* CV Document */}
                <div className="bg-white/90 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center">
                      <IdCard className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">CV Document</h3>
                  </div>
                  <div className="p-8 space-y-6">
                    {profile?.cvFile && profile.cvFile.url ? (
                      <div className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                            <FileUser className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-lg">{profile.cvFile.name}</p>
                            <p className="text-sm text-gray-500 font-semibold">PDF Document</p>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <button onClick={() => window.open(profile.cvFile.url, '_blank')} className="p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 hover:scale-110 shadow-lg">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button onClick={() => handleDownload(profile.cvFile.url, profile.cvFile.name)} className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 hover:scale-110 shadow-lg">
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-lg font-medium">No CV document found</p>
                      </div>
                    )}
                  </div>
                </div>
                {/* Application Info */}
                <div className="bg-white/90 backdrop-blur-sm rounded-b-[12px] shadow-xl border border-white/20 overflow-hidden">
                  <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-teal-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
                    </div>
                  </div>
                  <div className="p-8">
                    {application && (application._id || application.status || application.submittedAt || application.createdAt) ? (
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                          {application.status && (
                            <div className='mb-4'>
                              <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Status</label>
                              <div className={`inline-flex items-center space-x-2`}>
                                {getStatusIcon(application.status)}
                                <span className="font-bold capitalize">{application.status.replace('-', ' ')}</span>
                              </div>
                            </div>
                          )}
                          {application.submittedAt && (
                            <div className='mb-4'>
                              <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Submitted At</label>
                              <p className="text-gray-900 font-semibold text-lg">{formatDate(application.submittedAt)}</p>
                            </div>
                          )}
                          {application.createdAt && (
                            <div className='mb-4'>
                              <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Created At</label>
                              <p className="text-gray-900 font-semibold text-lg">{formatDate(application.createdAt)}</p>
                            </div>
                          )}
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                          {application._id && (
                            <div className='mb-4'>
                              <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Application ID</label>
                              <p className="text-gray-900 font-semibold text-lg font-mono">{application._id}</p>
                            </div>
                          )}
                          {application.rejectionReason && (
                            <div className='mb-4'>
                              <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Rejection Reason</label>
                              <p className="text-gray-900 font-semibold text-lg font-mono">{application.rejectionReason}</p>
                            </div>
                          )}
                        </div>
                        {application.adminNotes && (
                          <div className='mb-4'>
                            <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Admin Notes</label>
                            <p className="text-gray-900 font-semibold text-lg font-mono">{application.adminNotes}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-lg font-medium">No application details found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'second-phase' && (
              <div className="w-full">
                {/* Work Info */}
                <div className="bg-white/90 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-t-[12px]">
                  <div className="p-6 py-4 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-yellow-50 flex items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Work Information</h3>
                    </div>
                  </div>
                  <div className="p-8">
                    {profile?.workInfo && (profile.workInfo.employeeId || profile.workInfo.projectName || profile.workInfo.branch || profile.workInfo.shift || profile.workInfo.reference) ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
                        {profile.workInfo.employeeId && (
                          <div>
                            <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Employee ID</label>
                            <p className="text-gray-900 font-semibold text-lg">{profile.workInfo.employeeId}</p>
                          </div>
                        )}
                        {profile.workInfo.projectName && (
                          <div>
                            <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Project</label>
                            <p className="text-gray-900 font-semibold text-lg">{profile.workInfo.projectName}</p>
                          </div>
                        )}
                        {profile.workInfo.branch && (
                          <div>
                            <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Branch</label>
                            <p className="text-gray-900 font-semibold text-lg">{profile.workInfo.branch}</p>
                          </div>
                        )}
                        {profile.workInfo.shift && (
                          <div>
                            <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Shift</label>
                            <p className="text-gray-900 font-semibold text-lg capitalize">{profile.workInfo.shift}</p>
                          </div>
                        )}
                        {profile.workInfo.reference && (
                          <div>
                            <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Reference</label>
                            <p className="text-gray-900 font-semibold text-lg">{profile.workInfo.reference}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-lg font-medium">No work information found</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Personal Info */}
                <div className="bg-white/90 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden">
                  <div className="p-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Personal Documents</h3>
                    </div>
                  </div>
                  <div className="p-8">
                    {profile?.education && (profile.education.degree || profile.education.cgpaOrGpa || profile.education.passingYear || profile.education.certificateFile) ? (
                      <>
                        {(profile.education.degree || profile.education.cgpaOrGpa || profile.education.passingYear) && (
                          <div className="pb-8 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                            {profile.education.degree && (
                              <div>
                                <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Degree</label>
                                <p className="text-gray-900 font-semibold text-lg capitalize">{profile.education.degree}</p>
                              </div>
                            )}
                            {profile.education.cgpaOrGpa && (
                              <div>
                                <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">CGPA / GPA</label>
                                <p className="text-gray-900 font-semibold text-lg">{profile.education.cgpaOrGpa}</p>
                              </div>
                            )}
                            {profile.education.passingYear && (
                              <div>
                                <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Passing Year</label>
                                <p className="text-gray-900 font-semibold text-lg">{profile.education.passingYear}</p>
                              </div>
                            )}
                          </div>
                        )}
                        {profile.education.certificateFile && (
                          <div className='pb-8 space-y-4'>
                            <p className="text-gray-900 font-semibold text-lg">Certificate/ Mark Sheet (Latest)</p>
                            <div className="flex items-center justify-between bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-xl border border-gray-200">
                              <div className="flex items-center space-x-3">
                                <File className="w-5 h-5 text-indigo-600" />
                                <span className="text-gray-800 font-semibold">{profile.education.certificateFile.name}</span>
                              </div>
                              <button onClick={() => window.open(profile.education.certificateFile.url, '_blank')} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 hover:scale-110 transition">
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                        {profile?.testimonial && profile.testimonial.testimonialFile && (
                          <div className="space-y-4">
                            <p className="text-gray-900 font-semibold text-lg">
                              Testimonial/ Chairman Certificate
                              {profile.testimonial.title && (
                                <span className="font-bold text-gray-500 tracking-wide">: {profile.testimonial.title}</span>
                              )}
                            </p>
                            <div className="flex items-center justify-between bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl border border-gray-200">
                              <div className="flex items-center space-x-3">
                                <File className="w-5 h-5 text-purple-600" />
                                <span className="text-gray-800 font-semibold">{profile.testimonial.testimonialFile.name}</span>
                              </div>
                              <button onClick={() => window.open(profile.testimonial.testimonialFile.url, '_blank')} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 hover:scale-110 transition">
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-lg font-medium">No personal documents found</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Official Info */}
                <div className="bg-white/90 backdrop-blur-sm shadow-xl border border-white/20 overflow-hidden rounded-b-[12px]">
                  <div className="p-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 flex items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                        <FileSpreadsheet className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Official Documents</h3>
                    </div>
                  </div>
                  <div className="p-8">
                    {(profile?.myVerified && profile.myVerified.myVerifiedFile) || (profile?.commitmentNote && profile.commitmentNote.commitmentFile) ? (
                      <>
                        {profile?.myVerified && profile.myVerified.myVerifiedFile && (
                          <div className='pb-8 space-y-4'>
                            <p className="text-gray-900 font-semibold text-lg">
                              Personal Information Verified
                              {profile.myVerified.title && (
                                <span className="font-bold text-gray-500 tracking-wide"> Title : {profile.myVerified.title}</span>
                              )}
                            </p>
                            <div className="flex items-center justify-between bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-xl border border-gray-200">
                              <div className="flex items-center space-x-3">
                                <File className="w-5 h-5 text-indigo-600" />
                                <span className="text-gray-800 font-semibold">{profile.myVerified.myVerifiedFile.name}</span>
                              </div>
                              <button onClick={() => window.open(profile.myVerified.myVerifiedFile.url, '_blank')} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 hover:scale-110 transition">
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                        {profile?.commitmentNote && profile.commitmentNote.commitmentFile && (
                          <div className="space-y-4">
                            <p className="text-gray-900 font-semibold text-lg">
                              Letter of Understanding
                              {profile.commitmentNote.title && (
                                <span className="font-bold text-gray-500 tracking-wide"> Title : {profile.commitmentNote.title}</span>
                              )}
                            </p>
                            <div className="flex items-center justify-between bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl border border-gray-200">
                              <div className="flex items-center space-x-3">
                                <File className="w-5 h-5 text-purple-600" />
                                <span className="text-gray-800 font-semibold">{profile.commitmentNote.commitmentFile.name}</span>
                              </div>
                              <button onClick={() => window.open(profile.commitmentNote.commitmentFile.url, '_blank')} className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 hover:scale-110 transition">
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-lg font-medium">No official documents found</p>
                      </div>
                    )}
                  </div>
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

export default ApplicationDetails;