import request from '@/utils/request';

export async function query_question_list(query: object): Promise<any> {
  return request(`/api/questions?query=${query}`);
}
export async function query_question_detail(id: string): Promise<any> {
  return request(`/api/questions/${id}`, {
    method: 'GET',
  });
}

export async function add_question(params: any): Promise<any> {
  return request('/api/questions', {
    method: 'POST',
    data: params,
  });
}
export async function update_question(params: any): Promise<any> {
  return request(`/api/questions/${params._id}`, {
    method: 'PUT',
    data: params,
  });
}
export async function delete_question(id: string): Promise<any> {
  return request(`/api/questions/${id}`, {
    method: 'DELETE',
  });
}
