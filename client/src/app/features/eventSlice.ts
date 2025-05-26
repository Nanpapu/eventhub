import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import eventService, {
  EventFilter,
  OrganizerDashboardStats,
} from "../../services/event.service";
import { RootState } from "../store";

// Định nghĩa interface cho state
interface EventState {
  events: any[];
  event: any | null;
  savedEvents: any[];
  userEvents: any[];
  isLoading: boolean;
  error: string | null;
  totalEvents: number;
  currentPage: number;
  totalPages: number;
  filter: EventFilter;
  createSuccess: boolean;
  dashboardStats: OrganizerDashboardStats | null;
}

// Khởi tạo state
const initialState: EventState = {
  events: [],
  event: null,
  savedEvents: [],
  userEvents: [],
  isLoading: false,
  error: null,
  totalEvents: 0,
  currentPage: 1,
  totalPages: 1,
  filter: {
    keyword: "",
    category: "",
    location: "",
    page: 1,
    limit: 10,
  },
  createSuccess: false,
  dashboardStats: null,
};

// Async thunk để tạo sự kiện mới
export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData: any, { rejectWithValue }) => {
    try {
      return await eventService.createEvent(eventData);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create event"
      );
    }
  }
);

// Async thunk để lấy danh sách sự kiện
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (filter: EventFilter = {}, { rejectWithValue }) => {
    try {
      return await eventService.getEvents(filter);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  }
);

// Async thunk để lấy chi tiết sự kiện
export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await eventService.getEventById(id);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch event details"
      );
    }
  }
);

// Async thunk để lấy danh sách sự kiện đã lưu
export const fetchSavedEvents = createAsyncThunk(
  "events/fetchSavedEvents",
  async (_, { rejectWithValue }) => {
    try {
      return await eventService.getSavedEvents();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch saved events"
      );
    }
  }
);

// Async thunk để lấy thống kê dashboard cho tổ chức
export const fetchOrganizerDashboardStats = createAsyncThunk(
  "events/fetchOrganizerDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      return await eventService.getOrganizerDashboardStats();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard statistics"
      );
    }
  }
);

// Async thunk để lấy danh sách sự kiện của người dùng
export const fetchUserEvents = createAsyncThunk(
  "events/fetchUserEvents",
  async (_, { rejectWithValue }) => {
    try {
      return await eventService.getUserEvents();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user events"
      );
    }
  }
);

// Async thunk để lấy chi tiết sự kiện để chỉnh sửa
export const fetchEventForEdit = createAsyncThunk(
  "events/fetchEventForEdit",
  async (id: string, { rejectWithValue }) => {
    try {
      return await eventService.getEventForEdit(id);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch event for editing"
      );
    }
  }
);

// Async thunk để xóa sự kiện
export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id: string, { rejectWithValue }) => {
    try {
      return await eventService.deleteEvent(id);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete event"
      );
    }
  }
);

// Async thunk để ẩn/hiện sự kiện
export const toggleEventVisibility = createAsyncThunk(
  "events/toggleEventVisibility",
  async (
    { id, isHidden }: { id: string; isHidden: boolean },
    { rejectWithValue }
  ) => {
    try {
      return await eventService.toggleEventVisibility(id, isHidden);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update event visibility"
      );
    }
  }
);

// Tạo event slice
const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    // Reset state
    resetEventState: (state) => {
      state.error = null;
      state.isLoading = false;
      state.createSuccess = false;
    },
    // Cập nhật filter
    setFilter: (state, action: PayloadAction<EventFilter>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    // Reset filter
    resetFilter: (state) => {
      state.filter = initialState.filter;
    },
    // Cập nhật trang hiện tại
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create event cases
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.createSuccess = true;
        state.event = action.payload.event;
        // Thêm sự kiện mới vào danh sách sự kiện của người dùng nếu có
        if (state.userEvents.length > 0) {
          state.userEvents = [action.payload.event, ...state.userEvents];
        }
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.createSuccess = false;
      })

      // Fetch events cases
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.events;
        state.totalEvents = action.payload.totalEvents;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch event by id cases
      .addCase(fetchEventById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.event = action.payload;
        state.error = null;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch saved events cases
      .addCase(fetchSavedEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSavedEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savedEvents = action.payload;
        state.error = null;
      })
      .addCase(fetchSavedEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch user events cases
      .addCase(fetchUserEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userEvents = action.payload;
        state.error = null;
      })
      .addCase(fetchUserEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch organizer dashboard stats cases
      .addCase(fetchOrganizerDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrganizerDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardStats = action.payload;
        state.error = null;
      })
      .addCase(fetchOrganizerDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch event for edit cases
      .addCase(fetchEventForEdit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEventForEdit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.event = action.payload;
        state.error = null;
      })
      .addCase(fetchEventForEdit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Delete event cases
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Toggle event visibility cases
      .addCase(toggleEventVisibility.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleEventVisibility.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        // Cập nhật sự kiện trong danh sách nếu có
        if (state.userEvents.length > 0) {
          state.userEvents = state.userEvents.map((event) =>
            event.id === action.payload.event.id
              ? { ...event, isHidden: action.payload.event.isHidden }
              : event
          );
        }

        // Cập nhật event hiện tại nếu đang xem chi tiết
        if (state.event && state.event.id === action.payload.event.id) {
          state.event = {
            ...state.event,
            isHidden: action.payload.event.isHidden,
          };
        }
      })
      .addCase(toggleEventVisibility.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { resetEventState, setFilter, resetFilter, setCurrentPage } =
  eventSlice.actions;

// Export selectors
export const selectEvents = (state: RootState) => state.events.events;
export const selectEvent = (state: RootState) => state.events.event;
export const selectSavedEvents = (state: RootState) => state.events.savedEvents;
export const selectUserEvents = (state: RootState) => state.events.userEvents;
export const selectEventLoading = (state: RootState) => state.events.isLoading;
export const selectEventError = (state: RootState) => state.events.error;
export const selectEventFilter = (state: RootState) => state.events.filter;
export const selectTotalEvents = (state: RootState) => state.events.totalEvents;
export const selectCurrentPage = (state: RootState) => state.events.currentPage;
export const selectTotalPages = (state: RootState) => state.events.totalPages;
export const selectCreateSuccess = (state: RootState) =>
  state.events.createSuccess;
export const selectDashboardStats = (state: RootState) =>
  state.events.dashboardStats;

// Export reducer
export default eventSlice.reducer;
