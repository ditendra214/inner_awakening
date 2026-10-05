// ============================================================================
// INNER AWAKENING - SERVER-AUTHORITATIVE API CLIENT
// ============================================================================

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class APIClient {
  constructor() {
    this.token = localStorage.getItem('ia_jwt_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('ia_jwt_token', token);
    } else {
      localStorage.removeItem('ia_jwt_token');
    }
  }

  getHeaders(extra = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...extra
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    try {
      const res = await fetch(url, {
        ...options,
        headers: this.getHeaders(options.headers || {})
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(errorData.detail || `HTTP ${res.status}: ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      console.warn(`[APIClient] Request failed for ${endpoint}:`, err.message);
      throw err;
    }
  }

  // --- Auth Endpoints ---
  async login(username, password) {
    const form = new URLSearchParams();
    form.append('username', username);
    form.append('password', password);

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(err.detail || 'Login failed');
    }
    const data = await res.json();
    this.setToken(data.access_token);
    return data;
  }

  async register(username, email, password, characterPreset = 'normal_man') {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, character_preset: characterPreset })
    });
    if (data.tokens && data.tokens.access_token) {
      this.setToken(data.tokens.access_token);
    }
    return data;
  }

  // --- Authoritative Player Progression Endpoints ---
  async getProgression() {
    return await this.request('/player/progression');
  }

  async getRankDetails() {
    return await this.request('/player/rank');
  }

  async getPlayerStats() {
    return await this.request('/player/stats');
  }

  // --- Milestone Rewards & Claiming ---
  async getAvailableRewards() {
    return await this.request('/rewards/available');
  }

  async claimReward(rewardId, idempotencyKey = null) {
    const key = idempotencyKey || `claim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return await this.request(`/rewards/${rewardId}/claim`, {
      method: 'POST',
      headers: { 'X-Idempotency-Key': key }
    });
  }

  // --- Workouts & AI Telemetry Submission ---
  async submitWorkout(workoutData) {
    return await this.request('/workout/submit', {
      method: 'POST',
      body: JSON.stringify(workoutData)
    });
  }

  // --- Leaderboards ---
  async getLeaderboard(type = 'global', limit = 50) {
    return await this.request(`/leaderboard/${type}?limit=${limit}`);
  }

  // --- Inventory & Equipment ---
  async getInventory() {
    return await this.request('/inventory');
  }

  async equipItem(itemId) {
    return await this.request('/equipment/equip', {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId })
    });
  }

  async unequipItem(slot) {
    return await this.request('/equipment/unequip', {
      method: 'POST',
      body: JSON.stringify({ slot })
    });
  }
}

export const apiClient = new APIClient();
