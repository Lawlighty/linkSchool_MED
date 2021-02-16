import request from '@/utils/request';

export async function query_tag_list(): Promise<any> {
  return request('/api/tags');
}
