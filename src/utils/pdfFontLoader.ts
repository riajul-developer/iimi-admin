export const loadBengaliFont = async () => {
  try {
    const fontPath = '/fonts/SolaimanLipi.ttf';
    const response = await fetch(fontPath);
    if (!response.ok) {
      throw new Error('Failed to load font');
    }
    const fontBlob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(fontBlob);
    });
  } catch (error) {
    console.error('Error loading Bengali font:', error);
    return null;
  }
};