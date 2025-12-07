// Buat Class Event Bus
class EventBus {
    // Konstruktor: Inisialisasi listener
    constructor() {
        this.listeners = {};
    }

    // Fungsi untuk menambahkan listener
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    // Fungsi untuk menghapus listener
    off(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    // Fungsi untuk memicu event
    emit(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(callback => callback(data));
    }
}
// Export Event Bus
export const eventBus = new EventBus();