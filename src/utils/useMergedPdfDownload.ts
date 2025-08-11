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

  // Helper function to check if text contains Bengali characters
  const containsBengali = (text: string): boolean => {
    return /[\u0980-\u09FF]/.test(text);
  };

  // Helper function to set appropriate font based on text content
  const setAppropriateFont = (pdf: jsPDF, text: string, isBold: boolean = false, fontLoaded: boolean = false) => {
    if (containsBengali(text) && fontLoaded) {
      pdf.setFont('SolaimanLipi');
    } else {
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    }
  };

  // Custom text splitting function for Bengali text
  const splitBengaliText = (pdf: jsPDF, text: string, maxWidth: number): string[] => {
    if (!containsBengali(text)) {
      return pdf.splitTextToSize(text, maxWidth);
    }

    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const lineWidth = pdf.getTextWidth(testLine);

      if (lineWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // If single word is too long, we have to break it
          lines.push(word);
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.length > 0 ? lines : [text];
  };

  const createApplicationDetailsPDF = async (applicationData: ApplicationData) => {
    const { application, profile } = applicationData;
    const pdf = new jsPDF();

    let bengaliFontLoaded = false;
    const fontData = await loadBengaliFont();
    if (fontData) {
      const fontDataBase64 = fontData.split(',')[1];
      pdf.addFileToVFS('SolaimanLipi', fontDataBase64);
      pdf.addFont('SolaimanLipi', 'SolaimanLipi', 'normal');
      bengaliFontLoaded = true;
    }

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;
    const lineHeight = 7;
    const leftMargin = 15;
    const rightMargin = pageWidth - 15;

    // Add profile picture at the top, centered
    if (profile?.basic?.profilePicFile?.url) {
      try {
        const response = await fetch(profile.basic.profilePicFile.url);
        if (response.ok) {
          const blob = await response.blob();
          const imgDataUrl = await blobToDataURL(blob);
          const img = new Image();
          img.src = imgDataUrl;
          await new Promise((resolve) => { img.onload = resolve; });

          const maxImgHeight = 35;
          let imgWidth = img.width;
          let imgHeight = img.height;
          if (imgHeight > maxImgHeight) {
            imgWidth = (imgWidth * maxImgHeight) / imgHeight;
            imgHeight = maxImgHeight;
          }
          const x = (pageWidth - imgWidth) / 2;
          const y = yPosition;
          pdf.addImage(imgDataUrl, 'JPEG', x, y, imgWidth, imgHeight);
          yPosition += imgHeight + 8;

          // Add name below image, centered
          if (profile?.basic?.fullName) {
            pdf.setFontSize(16);
            setAppropriateFont(pdf, profile.basic.fullName, true, bengaliFontLoaded);
            pdf.setTextColor(34, 34, 34);
            pdf.text(profile.basic.fullName, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 15;
          }
        }
      } catch (err) {
        console.error('Failed to load profile picture for PDF', err);
      }
    }

    // Header (if no profile picture)
    if (!profile?.basic?.profilePicFile?.url) {
      pdf.setFontSize(18);
      pdf.setTextColor(220, 38, 127);
      pdf.text('APPLICATION DETAILS', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;
    }

    // Helper function to add section
    const addSection = (title: string) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold'); // Section titles are always in English
      pdf.setTextColor(220, 38, 127);
      pdf.text(title, leftMargin, yPosition);
      yPosition += 8;
    };

    // Helper function to add field
    const addField = (label: string, value: string, indent = 0) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }

      // Label is always in English
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      pdf.text(label + ':', leftMargin + indent, yPosition);

      // Value might contain Bengali text
      pdf.setTextColor(0, 0, 0);
      setAppropriateFont(pdf, value, false, bengaliFontLoaded);

      const maxWidth = rightMargin - leftMargin - 55 - indent;

      // Use custom splitting for Bengali text
      const lines = splitBengaliText(pdf, value, maxWidth);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Set font again for each line to ensure consistency
        setAppropriateFont(pdf, line, false, bengaliFontLoaded);
        pdf.text(line, leftMargin + 55 + indent, yPosition + (i * lineHeight));
      }

      yPosition += lineHeight * lines.length;
    };

    // Application Info
    addSection('APPLICATION INFORMATION');
    if (application._id) addField('Application ID', application._id);
    if (application.status) addField('Status', application.status.replace('-', ' ').toUpperCase());
    if (application.submittedAt) addField('Submitted At', formatDate(application.submittedAt));
    if (application.createdAt) addField('Created At', formatDate(application.createdAt));
    if (application.rejectionReason) addField('Rejection Reason', application.rejectionReason);
    if (application.adminNotes) addField('Admin Notes', application.adminNotes);
    yPosition += 5;

    // Basic Information
    addSection('BASIC INFORMATION');
    if (profile?.basic?.fullName) addField('Full Name', profile.basic.fullName);
    if (profile?.basic?.email) addField('Email', profile.basic.email);
    if (profile?.basic?.phone) addField('Phone', profile.basic.phone);
    if (profile?.basic?.dateOfBirth) {
      addField('Date of Birth', formatDate(profile.basic.dateOfBirth));
      addField('Age', calculateAge(profile.basic.dateOfBirth) + ' years');
    }
    yPosition += 5;

    // Identity Information
    addSection('IDENTITY INFORMATION');
    if (profile?.identity?.number) addField('Identity Number', profile.identity.number);
    if (profile?.identity?.docFiles?.length > 0) {
      addField('Identity Documents', profile.identity.docFiles.length + ' file(s) uploaded');
    }
    yPosition += 5;

    // Address Information
    addSection('ADDRESS INFORMATION');
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
    addSection('OTHER INFORMATION');
    if (profile?.other?.fathersName) addField("Father's Name", profile.other.fathersName);
    if (profile?.other?.mothersName) addField("Mother's Name", profile.other.mothersName);
    if (profile?.other?.religion) addField('Religion', profile.other.religion);
    if (profile?.other?.gender) addField('Gender', profile.other.gender);
    if (profile?.other?.maritalStatus) addField('Marital Status', profile.other.maritalStatus);
    yPosition += 5;

    // Emergency Contact
    addSection('EMERGENCY CONTACT');
    if (profile?.emergencyContact?.name) addField('Name', profile.emergencyContact.name);
    if (profile?.emergencyContact?.phone) addField('Phone', profile.emergencyContact.phone);
    yPosition += 5;

    // Work Information
    if (profile?.workInfo) {
      addSection('WORK INFORMATION');
      if (profile.workInfo.employeeId) addField('Employee ID', profile.workInfo.employeeId);
      if (profile.workInfo.projectName) addField('Project Name', profile.workInfo.projectName);
      if (profile.workInfo.branch) addField('Branch', profile.workInfo.branch);
      if (profile.workInfo.shift) addField('Shift', profile.workInfo.shift);
      if (profile.workInfo.reference) addField('Reference', profile.workInfo.reference);
    }

    // Footer
    yPosition = pageHeight - 15;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Generated on ' + new Date().toLocaleDateString(), pageWidth / 2, yPosition, { align: 'center' });

    return pdf.output('arraybuffer');
  };

  const downloadAndViewMergedPdf = async (files: any[], applicationData?: ApplicationData) => {
    const profile = applicationData?.profile;
    try {
      const mergedPdf = await PDFDocument.create();

      // First, add application details page if data is provided
      if (applicationData) {
        const detailsPdfBytes = await createApplicationDetailsPDF(applicationData);
        const detailsPdf = await PDFDocument.load(detailsPdfBytes);
        const detailsPages = await mergedPdf.copyPages(detailsPdf, detailsPdf.getPageIndices());
        detailsPages.forEach(page => mergedPdf.addPage(page));
      }

      // Filter out profile picture from files to avoid duplication
      const filteredFiles = files.filter(f => !(profile?.basic?.profilePicFile?.url && f.url === profile.basic.profilePicFile.url));

      // Separate different types of documents
      const imageDocs = filteredFiles.filter(f => isImage(f.url));
      const pdfDocs = filteredFiles.filter(f => isPdf(f.url));

      // Group specific document types
      const nidImages = imageDocs.filter(f => f.label && f.label.toLowerCase().includes('nid'));
      const passportImages = imageDocs.filter(f => f.label && f.label.toLowerCase().includes('passport'));
      const otherImages = imageDocs.filter(f => !((f.label && (f.label.toLowerCase().includes('nid') || f.label.toLowerCase().includes('passport')))));

      // Helper to determine side
      const getSide = (label: string) => {
        if (label.toLowerCase().includes('front') || label.toLowerCase().includes('first')) return 'Front';
        if (label.toLowerCase().includes('back') || label.toLowerCase().includes('second')) return 'Back';
        return 'Document';
      };

      // Function to add image pairs on same page with vertical stacking
      const addImagePairVertical = async (pair: any[], titlePrefix: string = '') => {
        const tempDoc = new jsPDF();
        const pageWidth = tempDoc.internal.pageSize.getWidth();
        const pageHeight = tempDoc.internal.pageSize.getHeight();
        const margin = 10;
        const labelFontSize = 10;
        const maxImgWidth = pageWidth - margin * 2;
        const maxImgHeight = (pageHeight - margin * 3 - pair.length * 20) / pair.length; // Divide vertical space

        let y = margin;
        for (let j = 0; j < pair.length; j++) {
          const file = pair[j];
          if (!file) continue;

          try {
            const response = await fetch(file.url);
            if (!response.ok) continue;

            const blob = await response.blob();
            const imgDataUrl = await blobToDataURL(blob);
            const img = new Image();
            img.src = imgDataUrl;
            await new Promise(res => { img.onload = res; });

            // Calculate proper dimensions maintaining aspect ratio
            let imgWidth = img.width;
            let imgHeight = img.height;
            const aspectRatio = imgWidth / imgHeight;

            // Fit to width first
            if (imgWidth > maxImgWidth) {
              imgWidth = maxImgWidth;
              imgHeight = imgWidth / aspectRatio;
            }

            // Then check height and adjust if needed
            if (imgHeight > maxImgHeight) {
              imgHeight = maxImgHeight;
              imgWidth = imgHeight * aspectRatio;
            }

            // Center horizontally
            const x = (pageWidth - imgWidth) / 2;

            // Draw label above image
            tempDoc.setFontSize(labelFontSize);
            tempDoc.setFont('helvetica', 'bold');
            const label = titlePrefix ? `${titlePrefix} (${getSide(file.label)})` : (file.label || 'Document');
            tempDoc.text(label, pageWidth / 2, y + 5, { align: 'center' });
            tempDoc.setFont('helvetica', 'normal');

            // Draw image below label
            tempDoc.addImage(imgDataUrl, 'JPEG', x, y + 10, imgWidth, imgHeight);
            y += imgHeight + 30; // 10 for label, 20 for spacing
          } catch (err) {
            console.error(`Failed to load or process file: ${file.url}`, err);
          }
        }

        // Add this page to merged PDF
        const tempPdfBytes = tempDoc.output('arraybuffer');
        const tempPdf = await PDFDocument.load(tempPdfBytes);
        const copiedPages = await mergedPdf.copyPages(tempPdf, tempPdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      };

      // Handle NID images (front/back on same page, vertically)
      if (nidImages.length > 0) {
        const front = nidImages.find(f => getSide(f.label) === 'Front') || nidImages[0];
        const back = nidImages.find(f => getSide(f.label) === 'Back');
        await addImagePairVertical([front, back].filter(Boolean), 'NID');
      }

      // Handle Passport images (front/back on same page, vertically)
      if (passportImages.length > 0) {
        const front = passportImages.find(f => getSide(f.label) === 'Front') || passportImages[0];
        const back = passportImages.find(f => getSide(f.label) === 'Back');
        await addImagePairVertical([front, back].filter(Boolean), 'Passport');
      }

      // Handle other images, one per page, vertically
      for (let i = 0; i < otherImages.length; i++) {
        const single = [otherImages[i]];
        await addImagePairVertical(single);
      }

      // Handle PDF documents (with label page before each)
      for (const file of pdfDocs) {
        try {
          const response = await fetch(file.url);
          if (!response.ok) continue;

          const arrayBuffer = await response.arrayBuffer();
          const label = file.label || 'Document';

          // Add label page
          const tempDoc = new jsPDF();
          tempDoc.setFontSize(14);
          tempDoc.setFont('helvetica', 'bold');
          tempDoc.text(label, tempDoc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
          tempDoc.setFont('helvetica', 'normal');

          const tempPdfBytes = tempDoc.output('arraybuffer');
          const tempPdf = await PDFDocument.load(tempPdfBytes);
          const labelPages = await mergedPdf.copyPages(tempPdf, tempPdf.getPageIndices());
          labelPages.forEach(page => mergedPdf.addPage(page));

          // Add actual PDF
          const pdf = await PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach(page => mergedPdf.addPage(page));
        } catch (err) {
          console.error(`Failed to load or process file: ${file.url}`, err);
        }
      }

      const finalPdf = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(finalPdf)], { type: 'application/pdf' });

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