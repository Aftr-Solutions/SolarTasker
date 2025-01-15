import { createAsyncThunk } from "@reduxjs/toolkit";
import { userRequest } from "../../apiRoutes/apiRouts";

// Fetch upcomiingTask
export const fetchUpcommingTasks = createAsyncThunk(
  "task/fetchupcommingaTask",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userRequest.get("selectupcomingtasks");
      console.log(response)
      return response.data.payload;

    } catch (error) {
      return rejectWithValue("Error occurred while fetching teams");
    }
  }
);
