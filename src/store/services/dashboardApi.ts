import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../../utils/baseQuery'

interface DashboardResponse {
  success: boolean;
  message: string;
  data: {
    totalApplications: number;
    submittedCount: number;
    underReviewCount: number;
    approvedCount: number;
    rejectedCount: number;
  };
}

export interface RecentApplication {
  _id: string;
  status: 'submitted' | 'under-review' | 'approved' | 'rejected';
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
    getDashboard: builder.query<DashboardResponse, void>({
      query: () => '/dashboard',
    }),
    getRecentApplications: builder.query<RecentApplicationsResponse, void>({
      query: () => '/recent-applications',
    }),
  }),
})

export const { useGetDashboardQuery, useGetRecentApplicationsQuery } = dashboardApi
