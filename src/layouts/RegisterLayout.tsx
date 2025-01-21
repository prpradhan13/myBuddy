import { Outlet } from 'react-router-dom'

function RegisterLayout() {
  return (
    <>
    <section className="flex-1 bg-[#000]">
      <Outlet />
    </section> 
    </>
  )
}

export default RegisterLayout