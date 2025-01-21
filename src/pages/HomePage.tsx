import { supabase } from "../utils/supabase"

const HomePage = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  }
  return (
    <div className='h-screen w-full bg-[#e6e6e6]'>
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  )
}

export default HomePage
