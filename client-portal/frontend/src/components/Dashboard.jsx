import Projects from "./Projects";

export default function Dashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-brand-purpleLight">
      {/* Навбар */}
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <h1 className="text-xl font-bold text-brand-purpleDark">Client Portal</h1>
        <div className="flex items-center gap-6">
          <a href="#" className="text-brand-purpleDark">Dashboard</a>
          <a href="#" className="text-brand-purpleDark">Projects</a>
          <a href="#" className="text-brand-purpleDark">Settings</a>
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-md bg-brand-peach text-brand-purpleDark hover:bg-brand-peachHover"
          >
            Log out
          </button>
        </div>
      </nav>

      {/* Основний контент */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <img
            src={user?.avatar || "https://i.pravatar.cc/40"}
            alt="profile"
            className="w-10 h-10 rounded-full border"
          />
          <h2 className="text-2xl font-bold text-brand-purpleDark">
            Welcome back, {user?.name || "User"}
          </h2>
        </div>
        <p className="text-brand-purpleDark/70 mb-8">
          Check out recent activity or start a new project.
        </p>

        {/* Підключаємо Projects */}
        <Projects />
      </div>
    </div>
  );
}
