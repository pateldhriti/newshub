export const isValidImage = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  const trimmed = url.trim();
  
  // Check for empty string
  if (trimmed === '') return false;
  
  // Check for empty quotes ""
  if (trimmed === '""' || trimmed === "''") return false;
  
  // Check for "None" or "null" strings (case insensitive)
  const lower = trimmed.toLowerCase();
  if (lower === 'none' || lower === 'null' || lower === 'undefined' || lower === 'n/a') return false;
  
  // Accept any non-empty string that's not a placeholder
  return true;
};

export const hasValidImage = (item) => {
  if (!item) return false;
  
  const imageLink = item.imageLink;
  const image = item.image;
  const img = item.img;
  
  const validImageLink = isValidImage(imageLink);
  const validImage = isValidImage(image);
  const validImg = isValidImage(img);
  
  const result = validImageLink || validImage || validImg;
  
  // Debug logging - remove this after testing
  if (!result && (imageLink || image || img)) {
    console.log('Filtered out item:', {
      title: item.title?.substring(0, 50),
      imageLink,
      image,
      img,
      validImageLink,
      validImage,
      validImg
    });
  }
  
  return result;
};

