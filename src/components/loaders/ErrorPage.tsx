import { Link } from "react-router-dom"


const ErrorPage = ({ errorMessage }: {errorMessage: string}) => {
  return (
    <div className='h-screen flex flex-col justify-center items-center bg-MainBackgroundColor'>
      <h1 className='text-3xl font-medium text-PrimaryTextColor'>Error</h1>
      <p className='text-lg font-medium text-PrimaryTextColor'> {errorMessage || "Opps, Something Went Wrong!"} </p>
      <Link to={"/"} className="text-blue-500 mt-4 font-semibold text-lg">Back to Home</Link>
    </div>
  )
}

export default ErrorPage
