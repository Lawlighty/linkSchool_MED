import request from '@/utils/request';

export async function query_tag_list(query: object): Promise<any> {
  // return request(`/api/tags/query=${query}`);
  return request(`/api/tags?query=${query}`);
}

export async function add_tag(params: any): Promise<any> {
  return request('/api/tags', {
    method: 'POST',
    data: params,
  });
}
export async function update_tag(params: any): Promise<any> {
  return request(`/api/tags/${params._id}`, {
    method: 'PUT',
    data: params,
  });
}
export async function delete_tag(id: string): Promise<any> {
  return request(`/api/tags/${id}`, {
    method: 'DELETE',
  });
}
