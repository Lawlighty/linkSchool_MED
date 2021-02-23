import request from '@/utils/request';

export async function query_category_list(query: object): Promise<any> {
  // return request(`/api/categorys/query=${query}`);
  return request(`/api/categorys?query=${query}`);
}

export async function add_category(params: any): Promise<any> {
  return request('/api/categorys', {
    method: 'POST',
    data: params,
  });
}
export async function update_category(params: any): Promise<any> {
  return request(`/api/categorys/${params._id}`, {
    method: 'PUT',
    data: params,
  });
}
export async function delete_category(id: string): Promise<any> {
  return request(`/api/categorys/${id}`, {
    method: 'DELETE',
  });
}
