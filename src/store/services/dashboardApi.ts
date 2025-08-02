import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../../utils/baseQuery'

interface DashboardResponse {
  success: boolean;
  message: string;
  data: {
    totalApplications: number;
    appliedCount: number;
    scheduledCount: number;
    selectedCount: number;
    underReviewCount: number;
    submittedCount: number;
    rejectedCount: number;
  };
}

export interface RecentApplication {
  _id: string;
  status: 'applied' | 'scheduled' | 'selected' | 'under-review' | 'submitted' | 'rejected';
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  submittedDate: string;
}

export interface RecentApplicationsResponse {
  success: boolean;
  message: string;
  data: RecentApplication[];
}

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery,
  endpoints: (builder) => ({
    getDashboard: builder.query<any, { startDate?: string; endDate?: string }>({
      query: ({ startDate, endDate } = {}) => {
        const params = new URLSearchParams();
        if (startDate) {
          params.append('startDate', startDate);
        }
        if (endDate) {
          params.append('endDate', endDate);
        }        
        const queryString = params.toString();
        return {
          url: `/dashboard${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
    }),
    getRecentApplications: builder.query<RecentApplicationsResponse, void>({
      query: () => '/recent-applications',
    }),
  }),
})

export const { useGetDashboardQuery, useGetRecentApplicationsQuery } = dashboardApi
