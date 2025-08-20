import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../../utils/baseQuery'

export interface Application {
  _id: string;
  status: 'applied' | 'scheduled' | 'selected' | 'under-review' | 'submitted' | 'rejected';
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  submittedDate: string;
}

export interface PaginationLinks {
  self: string;
  next: string | null;
  prev: string | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  links: PaginationLinks;
}

export interface ApplicationsResponse {
  success: boolean;
  message: string;
  data: {
    applications: Application[];
    meta: PaginationMeta;
  };
}

export const applicationApi = createApi({
  reducerPath: 'applicationApi',
  baseQuery,
  endpoints: (builder) => ({
    getApplications: builder.query<
      ApplicationsResponse,
      { page?: number; limit?: number; search?: string; status?: string; appliedFrom?: string; appliedTo?: string }
    >({
      query: ({ page = 1, limit = 10, search = '', status = '', appliedFrom = '', appliedTo = '' }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          ...(search ? { search } : {}),
          ...(status ? { status } : {}),
          ...(appliedFrom ? { appliedFrom } : {}),
          ...(appliedTo ? { appliedTo } : {}),
        });

        return `/applications?${params.toString()}`;
      },
    }),
    getApplicationById: builder.query<any, string>({
      query: (id) => `/applications/${id}`,
    }),
    updateApplication: builder.mutation<Application, { id: string; status: string; adminNotes?: string; rejectionReason?: string, remarkText?: string }>({
      query: ({ id, ...body }) => ({
        url: `/applications/${id}`,
        method: 'PUT',
        body,
      }),
    }),
  }),
});


export const { useGetApplicationsQuery, useGetApplicationByIdQuery, useUpdateApplicationMutation } = applicationApi
