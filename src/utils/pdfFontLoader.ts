export const loadBengaliFont = async (): Promise<string | null> => {
  try {
    const fontPath = '/fonts/SolaimanLipi.ttf';
    const response = await fetch(fontPath);
    
    if (!response.ok) {
      console.error(`Failed to load font: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const fontBlob = await response.blob();
    console.log('Font blob size:', fontBlob.size);
    
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        console.log('Font loaded successfully, data URL length:', result.length);
        resolve(result);
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        reject(error);
      };
      reader.readAsDataURL(fontBlob);
    });
  } catch (error) {
    console.error('Error loading Bengali font:', error);
    return null;
  }
};