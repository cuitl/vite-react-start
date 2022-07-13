export default function WindiPage() {
  return (
    <div className="bg-gray-800 w-screen h-100vh border-1px border-transparent">
      <div className="bg-gray-600 text-light-500 py-8 px-8 max-w-sm mx-auto rounded-xl shadow-md space-y-2 sm:(py-4 flex items-center space-y-0 space-x-6) my-6">
        <img
          className="block mx-auto h-24 rounded-full sm:(mx-0 flex-shrink-0)"
          src="/img/erin-lindford.jpg"
          alt="Woman's Face"
        />
        <div className="text-center space-y-2 sm:text-left">
          <div className="space-y-0.5">
            <p className="text-lg text-light-200 font-semibold">
              Erin Lindford
            </p>
            <p className="text-gray-500 font-medium">Product Engineer</p>
          </div>
          <button className="px-4 py-1 text-sm text-purple-400 font-semibold rounded-full border border-purple-200 hover:(text-white bg-purple-600 border-transparent) focus:(outline-none ring-2 ring-purple-600 ring-offset-2)">
            Message
          </button>
        </div>
      </div>
    </div>
  )
}
