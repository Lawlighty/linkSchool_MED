import request from '@/utils/request';

export async function query_document_list(query: object): Promise<any> {
  return request(`/api/documents?query=${query}`);
}
export async function query_document_detail(id: string): Promise<any> {
  return request(`/api/documents/${id}`, {
    method: 'GET',
  });
}

export async function add_document(params: any): Promise<any> {
  return request('/api/documents', {
    method: 'POST',
    data: params,
  });
}
export async function update_document(params: any): Promise<any> {
  return request(`/api/documents/${params._id}`, {
    method: 'PUT',
    data: params,
  });
}
export async function delete_document(id: string): Promise<any> {
  return request(`/api/documents/${id}`, {
    method: 'DELETE',
  });
}
