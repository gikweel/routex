import React, { useState } from 'react';
import { PinnedLocation } from '../types';

interface PinModalProps {
  coords: { lat: number; lng: number } | null;
  onSave: (pin: PinnedLocation) => void;
  onClose: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({ coords, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState<PinnedLocation['category']>('custom');

  if (!coords) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPin: PinnedLocation = {
      id: 'pin-' + Date.now(),
      title: title.trim(),
      address: address.trim() || `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
      lat: coords.lat,
      lng: coords.lng,
      category,
      createdAt: Date.now(),
    };

    onSave(newPin);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded p-5 flex flex-col gap-4 text-neutral-200">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h3 className="font-semibold text-sm text-white">Save Location</h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-white text-sm">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Location Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Office, Home, Coffee Stop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-400 mb-1">Address / Landmark</label>
            <input
              type="text"
              placeholder="e.g. 500 Market St"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-600"
              >
                <option value="custom">General Location</option>
                <option value="work">Work</option>
                <option value="home">Home</option>
                <option value="transit">Transit Hub</option>
                <option value="meeting">Meeting Spot</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1">Coordinates</label>
              <div className="bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs font-mono text-neutral-400 truncate">
                {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="py-1.5 px-3 rounded text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-1.5 px-3 rounded bg-white hover:bg-neutral-100 text-neutral-950 font-medium text-xs"
            >
              Save Pin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
