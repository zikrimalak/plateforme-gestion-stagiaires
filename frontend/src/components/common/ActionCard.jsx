// components/common/ActionCard.jsx
function ActionCard({ label, Icon, onClick, variant = 'default' }) {
  const styles = {
    default: 'bg-yellow-50 border-neutral-200 hover:border-primary text-neutral-800',
    danger: 'bg-white border-red-200 hover:border-red-400 text-red-600',
  }

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-xl p-4 border shadow-sm hover:shadow-md transition-all cursor-pointer ${styles[variant]}`}
    >
      <Icon size={22} className={variant === 'danger' ? 'text-red-500' : 'text-primary'} />
      <span className="text-xs font-medium text-center">{label}</span>
    </button>
  )
}

export default ActionCard