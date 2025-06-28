import React, { useState } from 'react';
import { User, LogOut, Menu, BarChart3, FileText, Eye, ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, ChevronDown, Download, ExternalLink, Shield, Lock, EyeOff, ArrowRight } from 'lucide-react';
import Login from './Login';
import TableList from './TableList';

// Types
interface Application {
  id: number;
  // Basic Information
  name: string;
  phone: string;
  email: string;
  photo?: string;
  
  // Identity Information
  nidOrBirthCert: string;
  dateOfBirth: string;
  cv?: string;
  
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactNumber: string;
  
  // Address Information
  presentAddress: string;
  permanentAddress: string;
  
  // Other Information
  fatherName: string;
  motherName: string;
  religion: string;
  gender: 'Male' | 'Female' | 'Other';
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  
  // Job Information
  position: string;
  appliedDate: string;
  status: 'submitted' | 'under-review' | 'approved' | 'rejected';
  
  // Second Phase (Optional - filled after approval)
  emid?: string;
  projectName?: string;
  branch?: string;
  shift?: string;
  reference?: string;
  
  // Documents
  educationalCertificate?: string;
  testimonial?: string;
  personalInfoVerified?: boolean;
  letterOfUnderstanding?: string;
  nda?: string;
  agreementPaper?: string;
}

// Sample data
const sampleApplications: Application[] = [
  {
    id: 1,
    // Basic Information
    name: "Rahim Uddin",
    phone: "01712345678",
    email: "rahim@email.com",
    photo: "passport_photo_1.jpg",
    
    // Identity Information
    nidOrBirthCert: "1234567890123",
    dateOfBirth: "1990-05-15",
    cv: "rahim_cv.pdf",
    
    // Emergency Contact
    emergencyContactName: "Fatema Khatun",
    emergencyContactNumber: "01798765432",
    
    // Address Information
    presentAddress: "House 12, Road 5, Dhanmondi, Dhaka",
    permanentAddress: "Village: Rampur, Post: Savar, Dhaka",
    
    // Other Information
    fatherName: "Abdul Karim",
    motherName: "Rashida Begum",
    religion: "Islam",
    gender: "Male" as const,
    maritalStatus: "Single" as const,
    
    // Job Information
    position: "Software Developer",
    appliedDate: "2025-06-15",
    status: "submitted" as const
  },
  {
    id: 2,
    // Basic Information
    name: "Fatema Khatun",
    phone: "01798765432",
    email: "fatema@email.com",
    photo: "passport_photo_2.jpg",
    
    // Identity Information
    nidOrBirthCert: "9876543210987",
    dateOfBirth: "1992-08-20",
    cv: "fatema_cv.pdf",
    
    // Emergency Contact
    emergencyContactName: "Ahmed Hassan",
    emergencyContactNumber: "01634567890",
    
    // Address Information
    presentAddress: "Flat 3B, House 25, Gulshan 2, Dhaka",
    permanentAddress: "Village: Mirzapur, Post: Tangail, Dhaka",
    
    // Other Information
    fatherName: "Mohammad Ali",
    motherName: "Salma Begum",
    religion: "Islam",
    gender: "Female" as const,
    maritalStatus: "Married" as const,
    
    // Job Information
    position: "UI/UX Designer",
    appliedDate: "2025-06-20",
    status: "approved" as const,
    
    // Second Phase Data (since approved)
    emid: "EMP001",
    projectName: "Mobile App Development",
    branch: "Dhaka Office",
    shift: "Morning",
    reference: "John Doe - Senior Designer"
  },
  {
    id: 3,
    // Basic Information
    name: "Karim Mia",
    phone: "01687654321",
    email: "karim@email.com",
    
    // Identity Information
    nidOrBirthCert: "5647382910374",
    dateOfBirth: "1988-12-10",
    
    // Emergency Contact
    emergencyContactName: "Nasir Ahmed",
    emergencyContactNumber: "01556789012",
    
    // Address Information
    presentAddress: "House 45, Uttara Sector 7, Dhaka",
    permanentAddress: "Village: Goalanda, Post: Rajbari, Dhaka",
    
    // Other Information
    fatherName: "Abdur Rahman",
    motherName: "Rahima Khatun",
    religion: "Islam",
    gender: "Male" as const,
    maritalStatus: "Married" as const,
    
    // Job Information
    position: "Project Manager",
    appliedDate: "2025-06-22",
    status: "rejected" as const
  },
  {
    id: 4,
    // Basic Information
    name: "Nasira Begum",
    phone: "01556789012",
    email: "nasira@email.com",
    
    // Identity Information
    nidOrBirthCert: "8765432109876",
    dateOfBirth: "1995-03-25",
    
    // Emergency Contact
    emergencyContactName: "Abdul Hamid",
    emergencyContactNumber: "01712345678",
    
    // Address Information
    presentAddress: "House 78, Banani DOHS, Dhaka",
    permanentAddress: "Village: Manikganj, Post: Manikganj Sadar",
    
    // Other Information
    fatherName: "Abdul Majid",
    motherName: "Halima Khatun",
    religion: "Islam",
    gender: "Female" as const,
    maritalStatus: "Single" as const,
    
    // Job Information
    position: "Data Analyst",
    appliedDate: "2025-06-25",
    status: "under-review" as const
  },
  {
    id: 5,
    // Basic Information
    name: "Ahmed Hassan",
    phone: "01634567890",
    email: "ahmed@email.com",
    
    // Identity Information
    nidOrBirthCert: "1928374650192",
    dateOfBirth: "1993-07-18",
    
    // Emergency Contact
    emergencyContactName: "Rashida Begum",
    emergencyContactNumber: "01798765432",
    
    // Address Information
    presentAddress: "House 32, Mohammadpur, Dhaka",
    permanentAddress: "Village: Cumilla, Post: Cumilla Sadar",
    
    // Other Information
    fatherName: "Mohammad Hasan",
    motherName: "Fatema Khatun",
    religion: "Islam",
    gender: "Male" as const,
    maritalStatus: "Single" as const,
    
    // Job Information
    position: "Frontend Developer",
    appliedDate: "2025-06-26",
    status: "submitted" as const
  }
];

const AdminTemplate: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'applications' | 'details'>('dashboard');
  const [applications, setApplications] = useState<Application[]>(sampleApplications);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const handleLogin = async () => {
        setIsLoading(true);
    };

  // Status change handler
  const handleStatusChange = (id: number, newStatus: Application['status']) => {
    setApplications(prev => prev.map(app => {
      if (app.id === id) {
        // Update selected application if it matches
        if (selectedApplication && selectedApplication.id === id) {
          setSelectedApplication({ ...app, status: newStatus });
        }
        
        return { ...app, status: newStatus };
      }
      return app;
    }));
  };

  // View details handler
  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setCurrentView('details');
  };

  // Handle CV download
  const handleCVDownload = (cvFileName: string) => {
    // In a real application, this would download the actual file
    const link = document.createElement('a');
    link.href = `/api/files/cv/${cvFileName}`;
    link.download = cvFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get status color
  const getStatusColor = (status: Application['status']): string => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status text
  const getStatusText = (status: Application['status']): string => {
    switch (status) {
      case 'submitted': return 'Submitted';
      case 'under-review': return 'Under Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  // Get status icon
  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'submitted': return <Clock className="w-4 h-4" />;
      case 'under-review': return <AlertCircle className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (!isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-600/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-400/20 to-pink-600/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-cyan-400/10 to-blue-600/10 blur-3xl"></div>
      </div>

      {/* Main Login Container */}
      <div className="relative w-full max-w-sm">
        <div className="bg-white/80 backdrop-blur-xl rounded-[5px] shadow-2xl border border-white/20 p-6 sm:p-8 sm:py-10 ">
          {/* Header Section */}
          <div className="text-center mb-4">
            <div className="relative mb-5">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
             IIMI Admin Sign In
            </h1>
          </div>

          {/* Form Section */}
          <div className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm text-left font-semibold text-gray-700">
                Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                </div>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full pl-10 pr-3 py-3 bg-gray-50/50 border border-gray-200 rounded-[4px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 text-gray-900 font-medium backdrop-blur-sm text-sm"
                  placeholder="Enter the email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm  text-left font-semibold text-gray-700">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50/50 border border-gray-200 rounded-[4px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 text-gray-900 font-medium backdrop-blur-sm text-sm"
                  placeholder="Enter the password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-5 rounded-[4px] hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg shadow-indigo-500/25 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-sm">Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-sm">Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Glow Effect */}
        <div className="absolute inset-x-0 -bottom-6 h-6 bg-gradient-to-t from-indigo-600/20 to-transparent blur-xl rounded-full"></div>
      </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <Menu className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 hidden sm:block">IIMI</h1>
            </div>
            
            {/* Centered Navigation Menu */}
            <div className="flex-1 flex justify-center">
              <div className="flex space-x-4 sm:space-x-8">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition duration-200 ${
                    currentView === 'dashboard' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
                
                <button
                  onClick={() => setCurrentView('applications')}
                  className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition duration-200 ${
                    currentView === 'applications' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Applications</span>
                </button>
              </div>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <div className="hidden sm:flex items-center space-x-2">
                <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Admin</span>
              </div>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition duration-200 p-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div>
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
              <p className="text-gray-600">Overview of your application management system</p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Applications</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{applications.length}</p>
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
                      {applications.filter(app => app.status === 'submitted').length}
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
                      {applications.filter(app => app.status === 'under-review').length}
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
                      {applications.filter(app => app.status === 'approved').length}
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
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                Position
                            </th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                Applied Date
                            </th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {applications.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50 transition duration-200">
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="bg-indigo-100 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                                                <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="text-sm font-medium text-left text-gray-900 truncate">{app.name}</div>
                                                <div className="text-sm text-gray-500 text-left truncate md:hidden">{app.position}</div>
                                                <div className="text-sm text-gray-500 text-left truncate">{app.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                    <div className="text-sm text-gray-900 text-left">{app.position}</div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                    <div className="text-sm text-gray-900 text-left">{app.appliedDate}</div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 sm:px-3 py-1 rounded-full text-left text-xs font-medium ${getStatusColor(app.status)} flex items-center space-x-1 w-fit`}>
                                            {getStatusIcon(app.status)}
                                            <span className="hidden sm:inline">{getStatusText(app.status)}</span>
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                                        <button
                                        onClick={() => handleViewDetails(app)}
                                        className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-2 sm:px-3 py-1 rounded-md text-xs font-medium transition duration-200 flex items-center justify-center space-x-1"
                                        >
                                        <Eye className="w-3 h-3" />
                                        <span>View</span>
                                        </button>
                                        <div className="relative">
                                        <select
                                            value={app.status}
                                            onChange={(e) => handleStatusChange(app.id, e.target.value as Application['status'])}
                                            className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-2 sm:px-3 py-1 w-[110px] rounded-md text-xs font-medium transition duration-200 border-none outline-none appearance-none cursor-pointer pr-6"
                                        >
                                            <option value="submitted">Submitted</option>
                                            <option value="under-review">Under Review</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        <ChevronDown className="w-3 h-3 absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
                                        </div>
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
        )}

        {/* Applications View */}
        {currentView === 'applications' && (
          <div>
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Applications</h2>
              <p className="text-gray-600">View and manage all applications</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Applicant
                        </th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                            Position
                        </th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                            Applied Date
                        </th>
                        <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-4 !pl-20 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {applications.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50 transition duration-200">
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="bg-indigo-100 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-medium text-left text-gray-900 truncate">{app.name}</div>
                                            <div className="text-sm text-gray-500 text-left truncate md:hidden">{app.position}</div>
                                            <div className="text-sm text-gray-500 text-left truncate">{app.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                <div className="text-sm text-gray-900 text-left">{app.position}</div>
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                                <div className="text-sm text-gray-900 text-left">{app.appliedDate}</div>
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 sm:px-3 py-1 rounded-full text-left text-xs font-medium ${getStatusColor(app.status)} flex items-center space-x-1 w-fit`}>
                                        {getStatusIcon(app.status)}
                                        <span className="hidden sm:inline">{getStatusText(app.status)}</span>
                                    </span>
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                                    <button
                                    onClick={() => handleViewDetails(app)}
                                    className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-2 sm:px-3 py-1 rounded-md text-xs font-medium transition duration-200 flex items-center justify-center space-x-1"
                                    >
                                    <Eye className="w-3 h-3" />
                                    <span>View</span>
                                    </button>
                                    <div className="relative">
                                    <select
                                        value={app.status}
                                        onChange={(e) => handleStatusChange(app.id, e.target.value as Application['status'])}
                                        className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-2 sm:px-3 py-1 w-[110px] rounded-md text-xs font-medium transition duration-200 border-none outline-none appearance-none cursor-pointer pr-6"
                                    >
                                        <option value="submitted">Submitted</option>
                                        <option value="under-review">Under Review</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                    <ChevronDown className="w-3 h-3 absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
                                    </div>
                                </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Details View */}
        {currentView === 'details' && selectedApplication && (
          <TableList />
        )}
      </div>
    </div>
  );
};

export default AdminTemplate;