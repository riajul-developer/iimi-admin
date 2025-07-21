import { PDFDocument } from 'pdf-lib';
import { jsPDF } from 'jspdf';
import { loadBengaliFont } from './pdfFontLoader';
const isImage = (url: string) => /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
const isPdf = (url: string) => /\.pdf$/i.test(url);

const blobToDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

interface ApplicationData {
  application: any;
  profile: any;
}

export const useMergedPdfDownload = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  const createApplicationDetailsPDF = async (applicationData: ApplicationData) => {
    const { application, profile } = applicationData;
    const pdf = new jsPDF();

    const fontData = await loadBengaliFont();
    if (fontData) {
        const fontDataBase64 = fontData.split(',')[1];
        pdf.addFileToVFS('SolaimanLipi', fontDataBase64);
        pdf.addFont('SolaimanLipi', 'SolaimanLipi', 'normal');
        pdf.setFont('SolaimanLipi');
    }
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;
    const lineHeight = 7;
    const leftMargin = 15;
    const rightMargin = pageWidth - 15;

    // Header
    pdf.setFontSize(18);
    pdf.setTextColor(220, 38, 127); // Pink color
    pdf.text('APPLICATION DETAILS', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Helper function to add section
    const addSection = (title: string, color: number[] = [0, 0, 0]) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.setFontSize(14);
      pdf.setTextColor(220, 38, 127);
      pdf.text(title, leftMargin, yPosition);
      yPosition += 10;
    };

    // Helper function to add field
    const addField = (label: string, value: string, indent = 0) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(label + ':', leftMargin + indent, yPosition);
      pdf.setTextColor(0, 0, 0);
      
      const maxWidth = rightMargin - leftMargin - 60 - indent;
      const lines = pdf.splitTextToSize(value, maxWidth);
      pdf.text(lines, leftMargin + 60 + indent, yPosition);
      yPosition += lineHeight * lines.length;
    };

    // Application Info
    addSection('APPLICATION INFORMATION', [34, 197, 94]);
    if (application._id) addField('Application ID', application._id);
    if (application.status) addField('Status', application.status.replace('-', ' ').toUpperCase());
    if (application.submittedAt) addField('Submitted At', formatDate(application.submittedAt));
    if (application.createdAt) addField('Created At', formatDate(application.createdAt));
    if (application.rejectionReason) addField('Rejection Reason', application.rejectionReason);
    if (application.adminNotes) addField('Admin Notes', application.adminNotes);

    yPosition += 5;

    // Basic Information
    addSection('BASIC INFORMATION', [59, 130, 246]);
    if (profile?.basic?.fullName) addField('Full Name', profile.basic.fullName);
    if (profile?.basic?.email) addField('Email', profile.basic.email);
    if (profile?.basic?.phone) addField('Phone', profile.basic.phone);
    if (profile?.basic?.dateOfBirth) {
      addField('Date of Birth', formatDate(profile.basic.dateOfBirth));
      addField('Age', calculateAge(profile.basic.dateOfBirth) + ' years');
    }

    yPosition += 5;

    // Identity Information
    addSection('IDENTITY INFORMATION', [168, 85, 247]);
    if (profile?.identity?.number) addField('Identity Number', profile.identity.number);
    if (profile?.identity?.docFiles?.length > 0) {
      addField('Identity Documents', profile.identity.docFiles.length + ' file(s) uploaded');
    }

    yPosition += 5;

    addSection('ADDRESS INFORMATION', [34, 197, 94]);
    if (profile?.address?.present) {
      const presentAddr = [
        profile?.address.present.street,
        profile.address.present.upazila,
        profile.address.present.district
      ].filter(Boolean).join(', ');
      if (presentAddr) addField('Present Address', presentAddr);
    }
    
    if (profile?.address?.permanent) {
      const permanentAddr = [
        profile.address.permanent.street,
        profile.address.permanent.upazila,
        profile.address.permanent.district
      ].filter(Boolean).join(', ');
      if (permanentAddr) addField('Permanent Address', permanentAddr);
    }

    yPosition += 5;

    // Other Information
    addSection('OTHER INFORMATION', [245, 158, 11]);
    if (profile?.other?.fathersName) addField("Father's Name", profile.other.fathersName);
    if (profile?.other?.mothersName) addField("Mother's Name", profile.other.mothersName);
    if (profile?.other?.religion) addField('Religion', profile.other.religion);
    if (profile?.other?.gender) addField('Gender', profile.other.gender);
    if (profile?.other?.maritalStatus) addField('Marital Status', profile.other.maritalStatus);

    yPosition += 5;

    // Emergency Contact
    addSection('EMERGENCY CONTACT', [239, 68, 68]);
    if (profile?.emergencyContact?.name) addField('Name', profile.emergencyContact.name);
    if (profile?.emergencyContact?.phone) addField('Phone', profile.emergencyContact.phone);

    yPosition += 5;

    // Work Information
    if (profile?.workInfo) {
      addSection('WORK INFORMATION', [168, 85, 247]);
      if (profile.workInfo.employeeId) addField('Employee ID', profile.workInfo.employeeId);
      if (profile.workInfo.projectName) addField('Project Name', profile.workInfo.projectName);
      if (profile.workInfo.branch) addField('Branch', profile.workInfo.branch);
      if (profile.workInfo.shift) addField('Shift', profile.workInfo.shift);
      if (profile.workInfo.reference) addField('Reference', profile.workInfo.reference);
    }

    // Footer
    yPosition = pageHeight - 15;
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Generated on ' + new Date().toLocaleDateString(), pageWidth / 2, yPosition, { align: 'center' });

    return pdf.output('arraybuffer');
  };

  const downloadAndViewMergedPdf = async (files: any[], applicationData?: ApplicationData) => {
    try {
      const mergedPdf = await PDFDocument.create();
      
      // First, add application details page if data is provided
      if (applicationData) {
        const detailsPdfBytes = await createApplicationDetailsPDF(applicationData);
        const detailsPdf = await PDFDocument.load(detailsPdfBytes);
        const detailsPages = await mergedPdf.copyPages(detailsPdf, detailsPdf.getPageIndices());
        detailsPages.forEach(page => mergedPdf.addPage(page));
      }

      // Then add all the uploaded files
      for (const file of files) {
        try {
          const response = await fetch(file.url);
          if (!response.ok) {
            continue;
          }

          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();

          if (isPdf(file.url)) {
            const pdf = await PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
          } else if (isImage(file.url)) {
            const imgDataUrl = await blobToDataURL(blob);
            const tempDoc = new jsPDF();
            
            // Get image dimensions to fit properly
            const img = new Image();
            img.src = imgDataUrl;
            await new Promise((resolve) => {
              img.onload = resolve;
            });

            const pageWidth = tempDoc.internal.pageSize.getWidth();
            const pageHeight = tempDoc.internal.pageSize.getHeight();
            const margin = 10;
            
            // Calculate dimensions to fit within page with margins
            const availableWidth = pageWidth - (margin * 2);
            const availableHeight = pageHeight - (margin * 2);
            
            let imgWidth = availableWidth;
            let imgHeight = (img.height * availableWidth) / img.width;
            
            if (imgHeight > availableHeight) {
              imgHeight = availableHeight;
              imgWidth = (img.width * availableHeight) / img.height;
            }
            
            const x = (pageWidth - imgWidth) / 2;
            const y = (pageHeight - imgHeight) / 2;
            
            tempDoc.addImage(imgDataUrl, 'JPEG', x, y, imgWidth, imgHeight);
            
            const tempPdfBytes = tempDoc.output('arraybuffer');
            const tempPdf = await PDFDocument.load(tempPdfBytes);
            const copiedPages = await mergedPdf.copyPages(tempPdf, tempPdf.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
          }
        } catch (err) {
          console.error(`Failed to load or process file: ${file.url}`, err);
        }
      }

      const finalPdf = await mergedPdf.save();
      const blob = new Blob([finalPdf], { type: 'application/pdf' });

      const filename = applicationData?.application?._id 
        ? `${applicationData?.profile?.basic?.fullName}-${applicationData.application._id.slice(-4)}.pdf`
        : 'application.pdf';

      // Download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();

      // Open in new tab
      const viewUrl = URL.createObjectURL(blob);
      window.open(viewUrl, '_blank');
      
      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
        URL.revokeObjectURL(viewUrl);
      }, 100);

    } catch (error) {
      console.error('Error creating merged PDF:', error);
      throw error;
    }
  };

  return { downloadAndViewMergedPdf };
};