import request from '@/utils/request';

export async function query_teacher_list(query: any): Promise<any> {
  return request(`/api/teachers?query=${query}`);
}
export async function query_teacher_detail(id: string, params: any): Promise<any> {
  return request(`/api/teachers/${id}`, {
    method: 'GET',
    data: params,
  });
}

export async function delete_teacher(id: string): Promise<any> {
  return request(`/api/teachers/${id}`, {
    method: 'DELETE',
  });
}
export async function update_teacher(params: any): Promise<any> {
  return request(`/api/teachers/toogle`, {
    method: 'POST',
    data: params,
  });
}
