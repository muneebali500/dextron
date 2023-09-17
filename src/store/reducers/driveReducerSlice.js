import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDirectories } from "../../api/api"; // Replace with your API function

export const fetchDriveData = createAsyncThunk("drive", async () => {
  const response = await getDirectories();
  console.log({ response });
  return response.data;
});

const driveSlice = createSlice({
  name: "drive",
  initialState: {
    allDocs: [],
    allFolders: [],
    isLoading: false,
  },
  reducers: {
    updateAllFolders: (state, action) => {
      state.allFolders = action.payload;
    },
    updateAllDocs: (state, action) => {
      state.allDocs = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDriveData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDriveData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allFolders = action.payload[0].subdirectories;
        state.allDocs = action.payload[0].files;
      })
      .addCase(fetchDriveData.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default driveSlice.reducer;
export const { updateAllFolders, updateAllDocs } = driveSlice.actions;
