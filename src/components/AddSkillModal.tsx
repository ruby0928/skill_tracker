import { useEffect, useState } from 'react';
import { useSkillStore } from '../store/useSkillStore';

const EMOJI_OPTIONS = [
  '💻', '🎵', '📚', '🎨', '🏃', '🍳', '✍️', '🗣️',
  '📐', '🎮', '🧘', '📷', '🎸', '🔬', '📊', '🎯',
  '🔧', '🌍', '⚽', '🎭', '🏊', '🥋', '🎹', '✏️',
];

interface Props {
  onClose: () => void;
}

const AddSkillModal = ({ onClose }: Props) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💻');
  const addSkill = useSkillStore((s) => s.addSkill);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addSkill(name.trim(), icon);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-5">新增技能</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">技能名稱</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：React、吉他、英文..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">選擇圖示</label>
            <div className="grid grid-cols-8 gap-1.5">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIcon(emoji)}
                  className={`h-9 rounded-lg text-xl transition-all ${
                    icon === emoji
                      ? 'bg-green-500/20 ring-2 ring-green-500 scale-110'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-gray-700 hover:border-gray-600 text-gray-400 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              新增
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSkillModal;
