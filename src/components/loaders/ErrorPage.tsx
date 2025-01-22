

const ErrorPage = ({ errorMessage }: {errorMessage: string}) => {
  return (
    <div className='h-screen flex flex-col justify-center items-center bg-MainBackgroundColor'>
      <h1 className='text-3xl font-medium text-PrimaryTextColor'>Error</h1>
      <p className='text-lg font-medium text-PrimaryTextColor'> {errorMessage || "Opps, Something Went Wrong!"} </p>
    </div>
  )
}

export default ErrorPage
