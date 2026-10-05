/**
 * Centralized Navigation Manager for Inner Awakening Fitness Game Client
 * Manages game-level page transitions, navigation history stack, and back navigation.
 */

class NavigationManager {
  constructor() {
    this.historyStack = ['lobby'];
    this.currentParams = {};
    this.subscribers = new Set();
  }

  getCurrentPage() {
    return this.historyStack[this.historyStack.length - 1] || 'lobby';
  }

  getParams() {
    return this.currentParams;
  }

  canGoBack() {
    const currentPage = this.getCurrentPage();
    // Only sub-pages are allowed to show the Back button
    const noBackPages = ['lobby', 'rank'];
    return this.historyStack.length > 1 && !noBackPages.includes(currentPage);
  }

  openPage(pageName, params = {}) {
    if (!pageName) return;
    const currentPage = this.getCurrentPage();
    if (currentPage === pageName) {
      this.currentParams = { ...params };
      this.notify();
      return;
    }

    this.historyStack.push(pageName);
    this.currentParams = { ...params };
    this.notify();
  }

  goBack() {
    if (this.historyStack.length > 1) {
      this.historyStack.pop();
      this.currentParams = {};
      this.notify();
      return true;
    }
    return false;
  }

  returnToLobby() {
    this.historyStack = ['lobby'];
    this.currentParams = {};
    this.notify();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    const page = this.getCurrentPage();
    const canBack = this.canGoBack();
    const params = this.currentParams;
    this.subscribers.forEach(cb => {
      try {
        cb({ page, canBack, params, stack: [...this.historyStack] });
      } catch (err) {
        console.error('Navigation subscriber error:', err);
      }
    });
  }
}

export const navigationManager = new NavigationManager();
