import { createAsyncThunk } from "@reduxjs/toolkit";
import { userRequest } from "../../apiRoutes/apiRouts";

// Fetch missingTask
export const fetchMissedTasks = createAsyncThunk(
  "task/fetchupcommingaTask",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userRequest.get("selectmissedtasks");
      console.log(response)
      return response.data.payload;

    } catch (error) {
      return rejectWithValue("Error occurred while fetching teams");
    }
  }
);
