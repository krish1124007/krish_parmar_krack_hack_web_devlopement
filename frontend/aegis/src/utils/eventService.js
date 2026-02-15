import apiFetch from './api.js';
import { API_ENDPOINTS } from '../config/api.config.js';

const BASE_URL = API_ENDPOINTS.EVENT.BASE;

// Faculty: Create a new event
export async function createEvent(eventData) {
    const formData = new FormData();
    formData.append('title', eventData.title);
    formData.append('description', eventData.description);
    formData.append('type', eventData.type);
    formData.append('domain', eventData.domain);
    formData.append('startDate', eventData.startDate);
    formData.append('endDate', eventData.endDate);
    formData.append('location', eventData.location);
    if (eventData.maxParticipants) {
        formData.append('maxParticipants', eventData.maxParticipants);
    }
    if (eventData.image instanceof File) {
        formData.append('image', eventData.image);
    } else if (typeof eventData.image === 'string') {
        formData.append('image', eventData.image);
    }

    const response = await apiFetch(`${BASE_URL}/create`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to create event');
    }
    return data.data;
}

// Faculty: Get all events created by the logged-in faculty
export async function getFacultyEvents() {
    const response = await apiFetch(`${BASE_URL}/faculty/events`, {
        method: 'GET',
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch faculty events');
    }
    return data.data;
}

// Student: Get all events (with optional filtering)
export async function getStudentEvents(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.domain) queryParams.append('domain', params.domain);
    if (params.type) queryParams.append('type', params.type);

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

    const response = await apiFetch(`${BASE_URL}/student/events${query}`, {
        method: 'GET',
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch events');
    }
    return data.data;
}

// Student: Register for an event
export async function registerForEvent(eventId) {
    const response = await apiFetch(`${BASE_URL}/register/${eventId}`, {
        method: 'POST',
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to register for event');
    }
    return data.data;
}

// Student: Unregister from an event
export async function unregisterFromEvent(eventId) {
    const response = await apiFetch(`${BASE_URL}/unregister/${eventId}`, {
        method: 'POST',
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to unregister from event');
    }
    return data.data;
}

// Admin: Get all events
export async function getAllEvents() {
    const response = await apiFetch(`${BASE_URL}/all`, {
        method: 'GET',
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch events');
    }
    return data.data;
}

// Update an event
export async function updateEvent(eventId, eventData) {
    const formData = new FormData();
    if (eventData.title) formData.append('title', eventData.title);
    if (eventData.description) formData.append('description', eventData.description);
    if (eventData.type) formData.append('type', eventData.type);
    if (eventData.domain) formData.append('domain', eventData.domain);
    if (eventData.startDate) formData.append('startDate', eventData.startDate);
    if (eventData.endDate) formData.append('endDate', eventData.endDate);
    if (eventData.location) formData.append('location', eventData.location);
    if (eventData.maxParticipants !== undefined) formData.append('maxParticipants', eventData.maxParticipants);
    if (eventData.status) formData.append('status', eventData.status);
    if (eventData.image instanceof File) {
        formData.append('image', eventData.image);
    }

    const response = await apiFetch(`${BASE_URL}/update/${eventId}`, {
        method: 'PATCH',
        body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to update event');
    }
    return data.data;
}

// Delete an event
export async function deleteEvent(eventId) {
    const response = await apiFetch(`${BASE_URL}/delete/${eventId}`, {
        method: 'DELETE',
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to delete event');
    }
    return data.data;
}

// Get event details
export async function getEventDetails(eventId) {
    const response = await apiFetch(`${BASE_URL}/${eventId}`, {
        method: 'GET',
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch event details');
    }
    return data.data;
}

export default {
    createEvent,
    getFacultyEvents,
    getStudentEvents,
    registerForEvent,
    unregisterFromEvent,
    getAllEvents,
    updateEvent,
    deleteEvent,
    getEventDetails,
};
