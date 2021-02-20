import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

export async function query_user_list(query: any): Promise<any> {
  return request(`/api/users?query=${query}`);
}
export async function query_user_detail(id: string, params: any): Promise<any> {
  return request(`/api/users/${id}`, {
    method: 'GET',
    data: params,
  });
}

export async function delete_user(id: string): Promise<any> {
  return request(`/api/users/${id}`, {
    method: 'DELETE',
  });
}
