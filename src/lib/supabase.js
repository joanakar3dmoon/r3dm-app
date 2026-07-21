// Supabase client para r3dm community app
const SUPA_URL = 'https://tolzqxflecqbjdefohom.supabase.co';
const SUPA_KEY = 'sb_publishable_aDlGZIIVARlRrtmednmZug_LffD21aU';

export const supabase = {
  async getMembers() {
    const res = await fetch(`${SUPA_URL}/rest/v1/users?role=eq.r3dm_member&select=*&order=created_at.desc&limit=50`, {
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` }
    });
    return res.json();
  },
  async getDonations() {
    const res = await fetch(`${SUPA_URL}/rest/v1/withdrawals?status=eq.donation&select=*&order=created_at.desc&limit=50`, {
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` }
    });
    return res.json();
  },
  async getTutorials() {
    const res = await fetch(`${SUPA_URL}/rest/v1/withdrawals?status=eq.tutorial&select=*&order=created_at.desc&limit=50`, {
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` }
    });
    return res.json();
  },
  async getStats() {
    const members = await this.getMembers();
    const donations = await this.getDonations();
    const supporters = Array.isArray(members) ? members.filter(m => m.note === 'supporter').length : 0;
    const creators = Array.isArray(members) ? members.filter(m => m.note === 'creator').length : 0;
    const totalDonations = Array.isArray(donations) ? donations.reduce((s, d) => s + (d.amount || 0), 0) : 0;
    return {
      totalMembers: Array.isArray(members) ? members.length : 0,
      supporters,
      creators,
      monthlyRevenue: (supporters * 5 + creators * 10).toFixed(2),
      totalDonations: totalDonations.toFixed(2),
    };
  }
};
