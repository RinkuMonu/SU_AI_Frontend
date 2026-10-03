import api from '@/lib/api';

export const socialService = {

  async publishToInstagram(contentId: string): Promise<any> {
    const res = await api.post(`/api/v1/social/publish-instagram/${contentId}`);
    return res.data;
  },

  async publishToFacebook(contentId: string): Promise<any> {
    const res = await api.post(`/api/v1/social/publish-facebook/${contentId}`);
    return res.data;
  },

  async publishToLinkedin(contentId: string): Promise<any> {
    const res = await api.post(`/api/v1/social/publish-linkedin/${contentId}`);
    return res.data;
  }
};
