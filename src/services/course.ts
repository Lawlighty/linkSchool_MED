import request from '@/utils/request';

export async function query_course_list(query: object): Promise<any> {
  return request(`/api/courses?query=${query}`);
}
export async function query_course_detail(id: string): Promise<any> {
  return request(`/api/courses/${id}`, {
    method: 'GET',
  });
}

export async function add_course(params: any): Promise<any> {
  return request('/api/courses', {
    method: 'POST',
    data: params,
  });
}
export async function update_course(params: any): Promise<any> {
  return request(`/api/courses/${params._id}`, {
    method: 'PUT',
    data: params,
  });
}
export async function delete_course(id: string): Promise<any> {
  return request(`/api/courses/${id}`, {
    method: 'DELETE',
  });
}
