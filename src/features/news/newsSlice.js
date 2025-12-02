import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { CloudCog } from 'lucide-react';

// Async thunk for fetching news data
export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching news...");

      const response = await axios.get('http://localhost:8080/api/home');
      console.log("News fetched successfully");
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    newsData: {
      topStories: [],
      trending: [],
      techArticles: [],
      politics: []
    },
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        
        // Categorize the news items from the flat array
        const categorizedData = {
          topStories: [],
          trending: [],
          techArticles: [],
          politics: []
        };
        
        // Map API response keys to state categories
        if (action.payload && typeof action.payload === 'object' && !Array.isArray(action.payload)) {
          Object.entries(action.payload).forEach(([key, items]) => {
            if (!Array.isArray(items)) return;

            const cleanItems = items.map(item => {
              // Normalize image field - check all possible variations
              const normalizedImage = item.imageLink || item.image || item.img || item.urlToImage || '';
              
              return {
                ...item,
                title: item.title?.replace(/^"|"$/g, '') || '',
                source: item.source?.replace(/^"|"$/g, '') || '',
                link: item.link?.replace(/^"|"$/g, '') || '',
                date: item.date?.replace(/^"|"$/g, '') || '',
                section: item.section?.replace(/^"|"$/g, '') || '',
                image: normalizedImage, // Standardize on 'image'
                imageLink: normalizedImage, // Keep for backward compatibility
                description: item.description?.replace(/^"|"$/g, '') || '',
                category: item.category?.replace(/^"|"$/g, '') || ''
              };
            });

            const lowerKey = key.toLowerCase();

            if (lowerKey.includes('trend')) {
              categorizedData.trending = [...categorizedData.trending, ...cleanItems];
            } else if (lowerKey.includes('tech')) {
              categorizedData.techArticles = [...categorizedData.techArticles, ...cleanItems];
            } else if (lowerKey.includes('politic')) {
              categorizedData.politics = [...categorizedData.politics, ...cleanItems];
            } else if (lowerKey.includes('top')) {
              categorizedData.topStories = [...categorizedData.topStories, ...cleanItems];
            } else {
              // Store 'MORE TO EXPLORE' and 'MOST WATCHED' in topStories temporarily, 
              // but we will also use them for backfilling below
              categorizedData.topStories = [...categorizedData.topStories, ...cleanItems];
            }
          });

          // --- SMART BACKFILL LOGIC ---
          // If categories are empty (like politics or trending), try to fill them from other data
          
          // 1. Collect ALL items into a single pool for filtering
          const allItems = [
            ...categorizedData.topStories,
            ...categorizedData.trending,
            ...categorizedData.techArticles,
            ...categorizedData.politics
          ];

          // 2. Backfill Politics if empty
          if (categorizedData.politics.length === 0) {
            categorizedData.politics = allItems.filter(item => {
              const cat = (item.category || '').toLowerCase();
              const title = (item.title || '').toLowerCase();
              const section = (item.section || '').toLowerCase();
              
              return (
                cat.includes('politic') || 
                cat.includes('government') || 
                cat.includes('world') || 
                cat.includes('europe') || 
                cat.includes('middle east') || 
                cat.includes('us & canada') ||
                cat.includes('asia') ||
                cat.includes('africa') ||
                title.includes('war') ||
                title.includes('minister') ||
                title.includes('president') ||
                title.includes('congress') ||
                title.includes('senate')
              );
            });
          }

          // 3. Backfill Trending if empty
          if (categorizedData.trending.length === 0) {
            // First try to use 'MOST WATCHED' or 'MORE TO EXPLORE' items if they were dumped into topStories
            // We can identify them by section name if preserved, or just take non-political, non-tech items
            
            categorizedData.trending = allItems.filter(item => {
              const section = (item.section || '').toLowerCase();
              const cat = (item.category || '').toLowerCase();
              
              // Explicitly grab items from these sections if they exist in the pool
              if (section.includes('watch') || section.includes('explore')) return true;
              
              // Or generic trending topics
              return (
                cat.includes('sport') || 
                cat.includes('lifestyle') || 
                cat.includes('entertainment') ||
                cat.includes('culture')
              );
            });
            
            // If still empty, just take some random items from topStories that aren't already in politics
            if (categorizedData.trending.length === 0) {
               categorizedData.trending = categorizedData.topStories.slice(5, 10);
            }
          }
          
          // Deduplicate: Ensure items don't appear in multiple categories if possible? 
          // Actually, for now it's fine if they duplicate, visibility is more important.

        } else if (Array.isArray(action.payload)) {
          // Fallback for flat array (if API changes back)
          action.payload.forEach(item => {
             // ... existing fallback logic if needed, or just map everything to topStories
             // For now, let's just put everything in topStories if it's a flat array
             // to avoid complex re-categorization that might fail
             // Normalize image field
             const normalizedImage = item.imageLink || item.image || item.img || item.urlToImage || '';

             const cleanItem = {
              ...item,
              title: item.title?.replace(/^"|"$/g, '') || '',
              source: item.source?.replace(/^"|"$/g, '') || '',
              link: item.link?.replace(/^"|"$/g, '') || '',
              date: item.date?.replace(/^"|"$/g, '') || '',
              section: item.section?.replace(/^"|"$/g, '') || '',
              image: normalizedImage,
              imageLink: normalizedImage,
              description: item.description?.replace(/^"|"$/g, '') || '',
              category: item.category?.replace(/^"|"$/g, '') || ''
            };
            categorizedData.topStories.push(cleanItem);
          });
        }
        
        state.newsData = categorizedData;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch news';
      });
  }
});

export default newsSlice.reducer;
