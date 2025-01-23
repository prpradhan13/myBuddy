import { Outlet } from 'react-router-dom'

function RegisterLayout() {
  return (
    <>
    <section className="w-full bg-MainBackgroundColor">
      <Outlet />
    </section> 
    </>
  )
}

export default RegisterLayout