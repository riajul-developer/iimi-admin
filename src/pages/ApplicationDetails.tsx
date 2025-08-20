import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  FileText,
  Download,
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
  UserCheck,
} from 'lucide-react';
import { useGetApplicationByIdQuery, useUpdateApplicationMutation } from '../store/services/applicationApi';
import StatusModal from '../components/StatusModal';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useMergedPdfDownload } from '../utils/useMergedPdfDownload';
import FileDisplay from '../components/FileDisplay';

const ApplicationDetails = () => {
  const { id } = useParams();
  const { data, isLoading, error, refetch } = useGetApplicationByIdQuery(id!);
  const [updateApplication] = useUpdateApplicationMutation();
  const [activeTab, setActiveTab] = useState('first-phase');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);


  const { downloadAndViewMergedPdf } = useMergedPdfDownload();

  const navigate = useNavigate();

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
    <div className="min-h-screen relative">
      <div className="bg-overlay"></div>
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-white/20 px-4 sm:px-6 py-3 sticky top-0 z-50">

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold text-sm sm:text-base">Back to Previous Page</span>
          </button>

          {/* Tabs and Status */}
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center justify-end gap-3 sm:gap-4">

            {/* Status Button */}
            <button
              onClick={() => setStatusModalOpen(!statusModalOpen)}
              className={`w-full sm:w-auto px-6 py-3 rounded-[12px] border-2 ${getStatusColor(application.status)} flex items-center justify-center sm:justify-start space-x-3 shadow-lg`}
            >
              {getStatusIcon(application.status)}
              <span className="font-bold capitalize text-sm tracking-wide">
                {application.status.replace('-', ' ')}
              </span>
            </button>

            {/* Tab Buttons */}
            {[
              { id: 'first-phase', label: '1st Phase', icon: FileText },
              { id: 'second-phase', label: '2nd Phase', icon: FileText },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full sm:w-auto flex items-center justify-center sm:justify-start space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                  ? 'bg-[#c31200] text-white shadow-lg transform scale-105'
                  : 'text-white hover:text-white bg-[#8e8e8e]'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Profile Card */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white/40 backdrop-blur-xs rounded-[12px] shadow-xl border border-white/20 overflow-hidden sticky top-20">
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

                {profile?.basic?.gender && (
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
                      <User className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-gray-900 font-medium capitalize">{profile.basic.gender}</span>
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
              <button
                onClick={() => {
                  setPdfDownloading(true);
                  const files: { label: string; url: string }[] = [];
                  if (profile?.basic?.profilePicFile?.url) {
                    files.push({ label: "Profile Picture", url: profile.basic.profilePicFile.url });
                  }

                  if (profile?.identity?.docFiles?.length > 0) {
                    for (const doc of profile.identity.docFiles) {
                      files.push({ label: `${doc.type} ${doc.side}`, url: doc.url });
                    }
                  }

                  if (profile?.cvFile?.url) {
                    files.push({ label: 'Resume / CV', url: profile?.cvFile?.url });
                  }

                  if (profile?.educationFiles?.sscCertFile) {
                    files.push({ label: 'SSC Certificate', url: profile?.educationFiles?.sscCertFile.url });
                  }

                  if (profile?.educationFiles?.lastCertFile) {
                    files.push({ label: 'Last Certificate', url: profile?.educationFiles?.lastCertFile.url });
                  }

                  if (profile?.testimonialFile) {
                    files.push({ label: 'Testimonial / Chairman Certificate', url: profile?.testimonialFile.url });
                  }

                  if (profile?.myVerifiedFile) {
                    files.push({ label: 'Personal Information Verified', url: profile?.myVerifiedFile.url });
                  }

                  if (profile?.commitmentFile) {
                    files.push({ label: 'Letter Of Understanding', url: profile?.commitmentFile.url });
                  }

                  if (profile?.ndaFiles?.firstPageFile) {
                    files.push({ label: 'NID First Page', url: profile?.ndaFiles?.firstPageFile.url });
                  }

                  if (profile?.ndaFiles?.secondPageFile) {
                    files.push({ label: 'NID Second Page', url: profile?.ndaFiles?.secondPageFile.url });
                  }

                  if (profile?.agreementFiles?.firstPageFile) {
                    files.push({ label: 'Agreement First Page', url: profile?.agreementFiles?.firstPageFile.url });
                  }

                  if (profile?.agreementFiles?.secondPageFile) {
                    files.push({ label: 'Agreement Second Page', url: profile?.agreementFiles?.secondPageFile.url });
                  }
                  console.log(files);

                  downloadAndViewMergedPdf(files, { application, profile })
                    .then(() => {
                      // Reset loading state after successful download
                      setTimeout(() => setPdfDownloading(false), 2000);
                    })
                    .catch((error) => {
                      console.error('PDF download failed:', error);
                      setPdfDownloading(false);
                    });
                }}
                disabled={pdfDownloading}
                className={`flex items-center gap-2 px-4 py-2 mx-auto rounded mb-7 transition-all duration-200 ${
                  pdfDownloading 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {pdfDownloading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Downloading PDF</span>
                  </>
                ) : (
                  <>
                    Download Pdf File
                    <Download size={18} />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="min-h-screen w-full">
            {/* Content */}
            {activeTab === 'first-phase' && (
              <div className="w-full">
                {/* Identity */}
                <div className="bg-white/40 backdrop-blur-xs rounded-t-[12px] shadow-xl border border-white/20 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center">
                      <IdCard className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">National ID Information</h3>
                  </div>
                  <div className="p-4 sm:p-8 space-y-6">
                    {/* Identity Files */}
                    <div>
                      {profile?.identity?.number && (
                        <h4 className="text-sm font-bold mb-4 text-gray-500 block uppercase tracking-wide">
                          NID Number :{' '}
                          <span className="text-lg text-gray-900">
                            {profile.identity.number}
                          </span>
                        </h4>
                      )}

                      {profile?.identity?.docFiles && profile.identity.docFiles.length > 0 ? (
                        <div
                          className={`grid grid-cols-1 ${profile.identity.docFiles.length > 1 ? 'lg:grid-cols-2' : ''
                            } gap-3 sm:gap-4`}
                        >
                          {profile.identity.docFiles.map((doc: any, index: number) => {
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
                                className="flex items-center justify-between p-3 sm:p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 hover:shadow-lg transition-all duration-200"
                              >
                                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0 pr-3">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base truncate">{label}</p>
                                    <p className="text-xs sm:text-sm text-gray-500 truncate font-medium">{doc.name}</p>
                                  </div>
                                </div>

                                <div className="shrink-0">
                                  <button
                                    onClick={() => window.open(doc.url, '_blank')}
                                    className="p-2 sm:p-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 hover:scale-105 flex items-center justify-center shadow-sm"
                                  >
                                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500 text-lg font-medium">No NID documents found</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
                {/* Emergency Contact */}
                <div className="bg-white/40 backdrop-blur-xs shadow-xl border border-white/20 overflow-hidden">
                  <div className="p-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center">
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
                <div className="bg-white/40 backdrop-blur-xs shadow-xl border border-white/20 overflow-hidden">
                  <div className="p-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center">
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
                <div className="bg-white/40 backdrop-blur-xs shadow-xl border border-white/20 overflow-hidden">
                  <div className="p-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center">
                        <Info className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Other Information</h3>
                    </div>
                  </div>
                  <div className="p-8">
                    {profile?.other && (profile.other.fathersName || profile.other.mothersName) ? (
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
                <div className="bg-white/40 backdrop-blur-xs shadow-xl border border-white/20 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center">
                      <IdCard className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">CV Document</h3>
                  </div>
                  <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                    {profile?.cvFile && profile.cvFile.url ? (
                      <div className="flex items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 border-2 border-gray-200 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0 pr-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                            <FileUser className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg truncate">{profile.cvFile.name}</p>
                            <p className="text-xs sm:text-sm text-gray-500 font-semibold">PDF Document</p>
                          </div>
                        </div>

                        <div className="flex space-x-2 sm:space-x-3 shrink-0">
                          <button
                            onClick={() => window.open(profile.cvFile.url, '_blank')}
                            className="p-2 sm:p-2.5 lg:p-3 bg-blue-500 text-white rounded-lg sm:rounded-xl hover:bg-blue-600 transition-all duration-200 hover:scale-105 sm:hover:scale-110 shadow-md sm:shadow-lg"
                          >
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <button
                            onClick={() => handleDownload(profile.cvFile.url, profile.cvFile.name)}
                            className="p-2 sm:p-2.5 lg:p-3 bg-green-500 text-white rounded-lg sm:rounded-xl hover:bg-green-600 transition-all duration-200 hover:scale-105 sm:hover:scale-110 shadow-md sm:shadow-lg"
                          >
                            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 sm:py-8">
                        <p className="text-gray-500 text-base sm:text-lg font-medium">No CV document found</p>
                      </div>
                    )}
                  </div>
                </div>
                {/* Application Info */}
                <div className="bg-white/40 backdrop-blur-xs rounded-b-[12px] shadow-xl border border-white/20 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50 flex items-center space-x-3">
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
                          {application.remarkText && (
                            <div className='mb-4'>
                              <label className="text-sm font-bold text-gray-500 mb-1 block uppercase tracking-wide">Remark Text</label>
                              <p className="text-gray-900 font-semibold text-lg font-mono">{application.remarkText}</p>
                            </div>
                          )}
                        </div>
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
                <div className="bg-white/40 backdrop-blur-xs shadow-xl border border-white/20 overflow-hidden rounded-t-[12px]">
                  <div className="p-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center">
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
                <div className="bg-white/40 backdrop-blur-xs shadow-xl border border-white/20 overflow-hidden">
                  <div className="p-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Personal Documents</h3>
                    </div>
                  </div>
                  <div className="p-8 space-y-8">
                    {/* SSC Certificate */}
                    {profile?.educationFiles?.sscCertFile && (
                      <FileDisplay
                        title="SSC Certificate / Mark Sheet"
                        file={profile.educationFiles.sscCertFile}
                        gradient="from-blue-100 to-indigo-100"
                        iconColor="text-indigo-600"
                      />
                    )}

                    {/* Last Certificate */}
                    {profile?.educationFiles?.lastCertFile && (
                      <FileDisplay
                        title="Last Certificate / Mark Sheet"
                        file={profile.educationFiles.lastCertFile}
                        gradient="from-blue-100 to-indigo-100"
                        iconColor="text-indigo-600"
                      />
                    )}

                    {/* Testimonial */}
                    {profile?.testimonialFile && (
                      <FileDisplay
                        title="Testimonial / Chairman Certificate"
                        file={profile.testimonialFile}
                        gradient="from-blue-100 to-indigo-100"
                        iconColor="text-indigo-600"
                      />
                    )}

                    {!profile?.educationFiles?.sscCertFile &&
                      !profile?.educationFiles?.lastCertFile &&
                      !profile?.testimonialFile && (
                        <div className="text-center py-8">
                          <p className="text-gray-500 text-lg font-medium">No personal documents found</p>
                        </div>
                      )}
                  </div>
                </div>

                {/* Official Info */}
                <div className="bg-white/40 backdrop-blur-xs shadow-xl border border-white/20 overflow-hidden rounded-b-[12px]">
                  <div className="p-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 flex items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                        <FileSpreadsheet className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Official Documents</h3>
                    </div>
                  </div>
                  <div className="p-8 space-y-8">
                    {/* My Verified File */}
                    {profile?.myVerifiedFile && (
                      <FileDisplay
                        title="Personal Info Verified"
                        file={profile.myVerifiedFile}
                        gradient="from-blue-100 to-indigo-100"
                        iconColor="text-indigo-600"
                      />
                    )}

                    {/* Commitment Note */}
                    {profile?.commitmentFile && (
                      <FileDisplay
                        title="Letter of Understanding"
                        file={profile.commitmentFile}
                        gradient="from-blue-100 to-indigo-100"
                        iconColor="text-indigo-600"
                      />
                    )}

                    {/* NID First Page */}
                    {profile?.ndaFiles?.firstPageFile && (
                      <FileDisplay
                        title="NID - First Page"
                        file={profile?.ndaFiles?.firstPageFile}
                        gradient="from-blue-100 to-indigo-100"
                        iconColor="text-indigo-600"
                      />
                    )}

                    {/* NID Second Page */}
                    {profile?.ndaFiles?.secondPageFile && (
                      <FileDisplay
                        title="NID - Second Page"
                        file={profile?.ndaFiles?.secondPageFile}
                        gradient="from-blue-100 to-indigo-100"
                        iconColor="text-indigo-600"
                      />
                    )}

                    {/* Agreement First Page */}
                    {profile?.agreementFiles?.firstPageFile && (
                      <FileDisplay
                        title="Agreement - First Page"
                        file={profile?.agreementFiles?.firstPageFile}
                        gradient="from-blue-100 to-indigo-100"
                        iconColor="text-indigo-600"
                      />
                    )}

                    {/* Agreement Second Page */}
                    {profile?.agreementFiles?.secondPageFile && (
                      <FileDisplay
                        title="Agreement - Second Page"
                        file={profile?.agreementFiles?.secondPageFile}
                        gradient="from-blue-100 to-indigo-100"
                        iconColor="text-indigo-600"
                      />
                    )}

                    {/* If no files */}
                    {!profile?.myVerifiedFile &&
                      !profile?.commitmentFile &&
                      !profile?.agreementFiles &&
                      !profile?.ndaFiles && (
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