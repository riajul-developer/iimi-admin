import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  FileText, 
  Download, 
  ExternalLink, 
  BarChart3, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  Shield,
  Award,
  Star
} from 'lucide-react';
import raihtn from "../storage/riajul-islam.jpg"
const TableList = () => {
  // Sample application data
  const selectedApplication = {
    id: 1,
    name: "Rahim Uddin",
    phone: "01712345678",
    email: "rahim@email.com",
    photo: "passport_photo_1.jpg",
    nidOrBirthCert: "1234567890123",
    dateOfBirth: "1990-05-15",
    cv: "rahim_cv.pdf",
    emergencyContactName: "Fatema Khatun",
    emergencyContactNumber: "01798765432",
    presentAddress: "House 12, Road 5, Dhanmondi, Dhaka",
    permanentAddress: "Village: Rampur, Post: Savar, Dhaka",
    fatherName: "Abdul Karim",
    motherName: "Rashida Begum",
    religion: "Islam",
    gender: "Male",
    maritalStatus: "Single",
    position: "Software Developer",
    appliedDate: "2025-06-15",
    status: "approved",
    emid: "EMP001",
    projectName: "Mobile App Development",
    branch: "Dhaka Office",
    shift: "Morning",
    reference: "John Doe - Senior Designer"
  };

  const [currentPhase, setCurrentPhase] = useState(1);

  const handleCVDownload = (cvFileName : any) => {
    const link = document.createElement('a');
    link.href = `/storage/Riajul Islam ( Software Engineer ).pdf`;
    link.download = cvFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status : any) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'under-review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status : any) => {
    switch (status) {
      case 'submitted': return <Clock className="w-4 h-4" />;
      case 'under-review': return <AlertCircle className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <button className="group flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-all duration-200 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 hover:border-indigo-200">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Back to Applications</span>
              </button>
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Application Details</h1>
                <p className="text-gray-600 mt-1">{selectedApplication.name}'s Complete Information</p>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className={`px-4 py-2 rounded-xl border ${getStatusColor(selectedApplication.status)} flex items-center space-x-2 shadow-sm`}>
              {getStatusIcon(selectedApplication.status)}
              <span className="font-semibold capitalize">{selectedApplication.status.replace('-', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Phase Toggle */}
        <div className="mb-8 flex justify-center">
          <div className="bg-white p-1 rounded-xl shadow-lg border border-gray-200">
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPhase(1)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  currentPhase === 1
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Phase 1: Primary Info</span>
              </button>
              <button
                onClick={() => setCurrentPhase(2)}
                disabled={selectedApplication.status !== 'approved'}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  currentPhase === 2 && selectedApplication.status === 'approved'
                    ? 'bg-green-500 text-white shadow-md'
                    : selectedApplication.status === 'approved'
                    ? 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    : 'text-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Phase 2: Employment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Phase 1 Content */}
        {currentPhase === 1 && (
          <div className="space-y-8">
            {/* Profile Overview Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r  from-blue-500 to-indigo-600 px-6 py-8 text-white">
                <div className="flex flex-col lg:flex-row items-center w-[690px] to-indigo-600 mx-auto space-y-6 lg:space-y-0 lg:space-x-8">
                  {/* Photo */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden">
                      {selectedApplication.photo ? (
                        <img 
                          src={raihtn} 
                          alt="Profile" 
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <User className="w-16 h-16 text-white/60" />
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-2 border-white">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  {/* Basic Info */}
                  <div className="text-center lg:text-left flex-1">
                    <h2 className="text-3xl font-bold mb-2">{selectedApplication.name}</h2>
                    <p className="text-blue-100 text-lg font-medium mb-4">{selectedApplication.position}</p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm">
                      <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-lg">
                        <Mail className="w-4 h-4" />
                        <span>{selectedApplication.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-lg">
                        <Phone className="w-4 h-4" />
                        <span>{selectedApplication.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-lg">
                        <Calendar className="w-4 h-4" />
                        <span>Applied: {selectedApplication.appliedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Identity Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Shield className="w-5 h-5 mr-3 text-indigo-600" />
                    Identity Information
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-sm font-semibold text-gray-600">NID/Birth Certificate</label>
                      <p className="text-lg font-mono text-gray-900 mt-1">{selectedApplication.nidOrBirthCert}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-sm font-semibold text-gray-600">Date of Birth</label>
                      <p className="text-lg text-gray-900 mt-1">{selectedApplication.dateOfBirth}</p>
                    </div>
                  </div>
                  
                  {/* CV Section */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <label className="text-sm font-semibold text-blue-700 mb-3 block">CV Document</label>
                    {selectedApplication.cv ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-500 p-2 rounded-lg">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{selectedApplication.cv}</p>
                            <p className="text-sm text-gray-600">PDF Document</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => window.open(`/api/files/cv/${selectedApplication.cv}`, '_blank')}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors duration-200 group"
                            title="View CV"
                          >
                            <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          </button>
                          <button 
                            onClick={() => handleCVDownload(selectedApplication.cv)}
                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors duration-200 group"
                            title="Download CV"
                          >
                            <Download className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No CV uploaded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-red-600" />
                    Emergency Contact
                  </h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <label className="text-sm font-semibold text-red-700">Contact Person</label>
                    <p className="text-lg font-medium text-gray-900 mt-1">{selectedApplication.emergencyContactName}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <label className="text-sm font-semibold text-red-700">Phone Number</label>
                    <p className="text-lg font-mono text-gray-900 mt-1">{selectedApplication.emergencyContactNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-green-600" />
                  Address Information
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <label className="text-sm font-semibold text-green-700 mb-3 block">Present Address</label>
                    <p className="text-gray-900 leading-relaxed">{selectedApplication.presentAddress}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <label className="text-sm font-semibold text-green-700 mb-3 block">Permanent Address</label>
                    <p className="text-gray-900 leading-relaxed">{selectedApplication.permanentAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-3 text-purple-600" />
                  Personal Information
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <label className="text-sm font-semibold text-purple-700">Father's Name</label>
                    <p className="text-lg font-medium text-gray-900 mt-1">{selectedApplication.fatherName}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <label className="text-sm font-semibold text-purple-700">Mother's Name</label>
                    <p className="text-lg font-medium text-gray-900 mt-1">{selectedApplication.motherName}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <label className="text-sm font-semibold text-purple-700">Religion</label>
                    <p className="text-lg font-medium text-gray-900 mt-1">{selectedApplication.religion}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <label className="text-sm font-semibold text-purple-700">Gender</label>
                    <p className="text-lg font-medium text-gray-900 mt-1">{selectedApplication.gender}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <label className="text-sm font-semibold text-purple-700">Marital Status</label>
                    <p className="text-lg font-medium text-gray-900 mt-1">{selectedApplication.maritalStatus}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase 2 Content */}
        {currentPhase === 2 && selectedApplication.status === 'approved' && (
          <div className="space-y-8">
            {/* Employment Overview */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-white">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
                    <Building className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Employment Information</h2>
                  <p className="text-green-100">Employee ID: {selectedApplication.emid}</p>
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Award className="w-5 h-5 mr-3 text-emerald-600" />
                  Job Assignment Details
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                    <label className="text-sm font-semibold text-emerald-700 mb-2 block">Employee ID</label>
                    <p className="text-xl font-mono font-bold text-gray-900">{selectedApplication.emid}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                    <label className="text-sm font-semibold text-emerald-700 mb-2 block">Project Name</label>
                    <p className="text-lg font-medium text-gray-900">{selectedApplication.projectName}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                    <label className="text-sm font-semibold text-emerald-700 mb-2 block">Branch</label>
                    <p className="text-lg font-medium text-gray-900">{selectedApplication.branch}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                    <label className="text-sm font-semibold text-emerald-700 mb-2 block">Work Shift</label>
                    <p className="text-lg font-medium text-gray-900">{selectedApplication.shift}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200 md:col-span-2">
                    <label className="text-sm font-semibold text-emerald-700 mb-2 block">Reference</label>
                    <p className="text-lg font-medium text-gray-900">{selectedApplication.reference}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Status */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <FileText className="w-5 h-5 mr-3 text-amber-600" />
                  Document Verification Status
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Personal Documents */}
                  <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                    <h4 className="text-lg font-bold text-amber-800 mb-4 flex items-center">
                      <Star className="w-5 h-5 mr-2" />
                      Personal Documents
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-amber-200">
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                        <span className="text-gray-900 font-medium">Educational Certificate/Mark Sheet (Latest)</span>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-amber-200">
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                        <span className="text-gray-900 font-medium">Testimonial/Chairman Certificate</span>
                      </div>
                    </div>
                  </div>

                  {/* Official Documents */}
                  <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                    <h4 className="text-lg font-bold text-amber-800 mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Official Documents
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-amber-200">
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                        <span className="text-gray-900 font-medium">Personal Information Verified</span>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-amber-200">
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                        <span className="text-gray-900 font-medium">Letter of Understanding</span>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-amber-200">
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                        <span className="text-gray-900 font-medium">NDA (2 Pages)</span>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-amber-200">
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                        <span className="text-gray-900 font-medium">Agreement Paper (2 Pages)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase 2 Not Available */}
        {currentPhase === 2 && selectedApplication.status !== 'approved' && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Building className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Phase 2 Not Available</h3>
              <p className="text-gray-600 leading-relaxed">
                Employment information will be available once the application is approved. 
                Current status: <span className="font-semibold capitalize">{selectedApplication.status.replace('-', ' ')}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableList;