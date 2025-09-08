import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  notifications: [],
  unreadCount: 0,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      // CRITICAL: Always use deep cloning to avoid reference issues
      state.user = JSON.parse(JSON.stringify(action.payload));
      state.isAuthenticated = !!action.payload;
    },
clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.notifications = [];
      state.unreadCount = 0;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    markNotificationAsRead: (state, action) => {
      const notificationId = action.payload;
      state.notifications = state.notifications.map(notification =>
        notification.Id === notificationId
          ? { ...notification, is_read_c: true }
          : notification
      );
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications = state.notifications.map(notification => ({
        ...notification,
        is_read_c: true
      }));
      state.unreadCount = 0;
    },
  },
});

export const { 
  setUser, 
  clearUser, 
  setNotifications, 
  setUnreadCount, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} = userSlice.actions;
export default userSlice.reducer;