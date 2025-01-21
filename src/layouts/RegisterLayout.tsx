import { Outlet } from 'react-router-dom'

function RegisterLayout() {
  return (
    <>
    <section className="w-full bg-[#000]">
      <Outlet />
    </section> 
    </>
  )
}

export default RegisterLayout