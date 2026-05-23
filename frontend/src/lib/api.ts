import type {
  Article,
  CreateSymptomLogPayload,
  DashboardData,
  HealthReport,
  LogPeriodPayload,
  SymptomLog,
  UpdateSymptomLogPayload,
  UpdateUserPayload,
} from '@/types';
import { USER_ID } from './user-id';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface MongoDocument {
  _id?: string;
  id?: string;
}

function withId<T extends MongoDocument>(doc: T): T & { id: string } {
  const id = doc._id?.toString() ?? doc.id ?? '';
  return { ...doc, id };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = (await response.json()) as { message?: string | string[] };
      if (body.message) {
        message = Array.isArray(body.message)
          ? body.message.join(', ')
          : body.message;
      }
    } catch {}
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

function mapSymptomLog(
  log: SymptomLog & { _id?: string; userId?: string },
): SymptomLog {
  const mapped = withId(log);
  return {
    ...mapped,
    userId: log.userId?.toString() ?? USER_ID,
    date:
      typeof log.date === 'string'
        ? log.date
        : new Date(log.date).toISOString(),
    createdAt:
      typeof log.createdAt === 'string'
        ? log.createdAt
        : new Date(log.createdAt).toISOString(),
  };
}

function mapArticle(article: Article & { _id?: string }): Article {
  return withId(article);
}

export const api = {
  
  getDashboard: async (): Promise<DashboardData> => {
    const data = await handleResponse<
      Omit<DashboardData, 'user'> & {
        user: Omit<DashboardData['user'], 'id'>;
      }
    >(await fetch(`${BASE}/api/dashboard/${USER_ID}`));
    return {
      ...data,
      user: {
        ...data.user,
        id: USER_ID,
        referralBannerDismissed: data.user.referralBannerDismissed ?? false,
        pregnancyWidgetDismissed: data.user.pregnancyWidgetDismissed ?? false,
      },
      recommendedArticles: data.recommendedArticles.map(mapArticle),
    };
  },

  
  updateUser: async (data: UpdateUserPayload): Promise<void> => {
    await handleResponse(
      await fetch(`${BASE}/api/users/${USER_ID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    );
  },

  
  getHealthReport: async (month?: string): Promise<HealthReport> => {
    const query = month ? `?month=${month}` : '';
    const data = await handleResponse<HealthReport>(
      await fetch(`${BASE}/api/health-report/${USER_ID}${query}`),
    );
    return {
      ...data,
      historicalLogs: data.historicalLogs.map(mapSymptomLog),
    };
  },

  
  getSymptomLogs: async (month?: string): Promise<SymptomLog[]> => {
    const query = month ? `?month=${month}` : '';
    const logs = await handleResponse<(SymptomLog & { _id?: string })[]>(
      await fetch(`${BASE}/api/symptoms/${USER_ID}${query}`),
    );
    return logs.map(mapSymptomLog);
  },

  
  saveSymptomLog: async (
    data: CreateSymptomLogPayload,
  ): Promise<SymptomLog> => {
    const log = await handleResponse<SymptomLog & { _id?: string }>(
      await fetch(`${BASE}/api/symptoms/${USER_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    );
    return mapSymptomLog(log);
  },

  
  updateSymptomLog: async (
    logId: string,
    data: UpdateSymptomLogPayload,
  ): Promise<SymptomLog> => {
    const log = await handleResponse<SymptomLog & { _id?: string }>(
      await fetch(`${BASE}/api/symptoms/${USER_ID}/${logId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    );
    return mapSymptomLog(log);
  },

  
  deleteSymptomLog: async (logId: string): Promise<void> => {
    const response = await fetch(`${BASE}/api/symptoms/${USER_ID}/${logId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      await handleResponse(response);
    }
  },

  
  logPeriod: async (data: LogPeriodPayload): Promise<void> => {
    await handleResponse(
      await fetch(`${BASE}/api/cycle/${USER_ID}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    );
  },
};
