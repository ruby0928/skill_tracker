import { useState } from 'react';
import { useSkillStore } from '../store/useSkillStore';
import SkillCard from './SkillCard';
import AddSkillModal from './AddSkillModal';
import ActiveTimerBar from './ActiveTimerBar';
import DevPanel from './DevPanel';

const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-28 text-gray-600">
    <span className="text-6xl mb-4">🎮</span>
    <p className="text-lg font-medium text-gray-400">還沒有任何技能</p>
    <p className="text-sm mt-1">點擊「新增技能」開始你的第一項練習！</p>
  </div>
);

const Dashboard = () => {
  const skills = useSkillStore((s) => s.skills);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#0d0f1a]">
      <ActiveTimerBar />

      <header className="px-6 py-5 border-b border-gray-800/60 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Skill Tracker</h1>
          <p className="text-sm text-gray-500 mt-0.5">模擬市民風格技能累計</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition-colors text-sm"
        >
          ＋ 新增技能
        </button>
      </header>

      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.length === 0 ? (
          <EmptyState />
        ) : (
          skills.map((skill) => <SkillCard key={skill.id} skill={skill} />)
        )}
      </main>

      {showModal && <AddSkillModal onClose={() => setShowModal(false)} />}
      <DevPanel />
    </div>
  );
};

export default Dashboard;
