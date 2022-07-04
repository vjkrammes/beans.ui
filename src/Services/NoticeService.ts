import { INoticeModel } from '../Interfaces/INoticeModel';
import { IApiResponse } from '../Interfaces/IApiResponse';
import { http } from './http';
import { createApiResponse } from './tools';

export async function getNotices(
  userid: string,
  token: string,
): Promise<INoticeModel[]> {
  const response = await http<INoticeModel[]>({
    path: `/Notice/${userid}`,
    token: token,
  });
  if (response && response.body && response.ok) {
    return response.body;
  }
  console.error('Failed to retrieve notices for user with id ' + userid);
  return [];
}

export async function getUnreadNoticeCount(userId: string) {
  const response = await http<number>({
    path: `/Notice/UnreadCount/${userId}`,
  });
  if (response && response.ok && response.body) {
    return response.body;
  }
  return 0;
}

export async function markRead(
  id: string,
  token: string,
): Promise<IApiResponse> {
  const response = await http<IApiResponse>({
    path: `/Notice/MarkRead/${id}`,
    method: 'put',
    token: token,
  });
  return createApiResponse(response);
}

export async function deleteNotice(
  id: string,
  token: string,
): Promise<IApiResponse> {
  const response = await http<IApiResponse>({
    path: `/Notice/Delete/${id}`,
    method: 'delete',
    token: token,
  });
  return createApiResponse(response);
}
