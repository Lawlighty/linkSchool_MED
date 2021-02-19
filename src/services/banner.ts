import request from '@/utils/request';

export async function query_banner_list(query: object): Promise<any> {
  return request(`/api/banners?query=${query}`);
}

export async function add_banner(params: any): Promise<any> {
  return request('/api/banners', {
    method: 'POST',
    data: params,
  });
}
export async function update_banner(params: any): Promise<any> {
  return request(`/api/banners/${params._id}`, {
    method: 'PUT',
    data: params,
  });
}
export async function delete_banner(id: string): Promise<any> {
  return request(`/api/banners/${id}`, {
    method: 'DELETE',
  });
}
