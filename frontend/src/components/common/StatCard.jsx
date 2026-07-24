// components/common/StatCard.jsx
import { useNavigate } from 'react-router-dom'

function StatCard({ label, value, Icon, color = 'primary', to }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => to && navigate(to)}
      className={`bg-white rounded-xl p-6 border border-neutral-200 shadow-sm flex items-center gap-4 ${to ? 'cursor-pointer hover:shadow-md hover:border-primary transition-all' : ''}`}
    >
      <div className={`p-3 rounded-lg bg-${color}/10`}>
        <Icon className={`text-${color}`} size={24} />
      </div>
      <div>
        <p className="text-2xl font-bold text-neutral-800">{value}</p>
        <p className="text-sm text-neutral-500">{label}</p>
      </div>
    </div>
  )
}

export default StatCard