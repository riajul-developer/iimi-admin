import { Eye, File } from 'lucide-react';

interface FileDisplayProps {
  title: string;
  file: { name: string; url: string };
  gradient: string;
  iconColor: string;
}
const FileDisplay = ({ title, file, gradient, iconColor }: FileDisplayProps) => (
  <div>
    <p className="text-gray-900 font-semibold text-lg">{title}</p>
    <div className={`flex items-center justify-between bg-gradient-to-r ${gradient} p-4 rounded-xl border border-gray-200`}>
      <div className="flex items-center space-x-3">
        <File className={`w-5 h-5 ${iconColor}`} />
        <span className="text-gray-800 font-semibold">{file.name}</span>
      </div>
      <button
        onClick={() => window.open(file.url, '_blank')}
        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 hover:scale-110 transition"
      >
        <Eye className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default FileDisplay;
