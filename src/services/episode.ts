import request from '@/utils/request';

export async function query_episode_list(query: object): Promise<any> {
  return request(`/api/episodes?query=${query}`);
}
export async function query_episode_detail(id: string): Promise<any> {
  return request(`/api/episodes/${id}`, {
    method: 'GET',
  });
}

export async function add_episode(params: any): Promise<any> {
  return request('/api/episodes', {
    method: 'POST',
    data: params,
  });
}
export async function update_episode(params: any): Promise<any> {
  return request(`/api/episodes/${params._id}`, {
    method: 'PUT',
    data: params,
  });
}
export async function update_episode_list_course(params: any): Promise<any> {
  return request(`/api/episodes/updatepisodes`, {
    method: 'PUT',
    data: params,
  });
}
export async function delete_episode(id: string): Promise<any> {
  return request(`/api/episodes/${id}`, {
    method: 'DELETE',
  });
}
