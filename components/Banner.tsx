

function Banner() {
  return (
    <main className='flex items-center justify-between bg-yellow-400 border-y border-black py-10 lg:py-0 mt-2'>
        <div className='px-10 space-y-5'>
            <h2 className='text-6xl max-w-6xl font-serif'>
                <span className='underline decoration-black decoration-4'>Medium</span> is a place to write, read and connect.
            </h2>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo temporibus molestias atque ad dolorum voluptates beatae laboriosam vel, cum pariatur. Dolorum, id quibusdam.</p>
        </div>

        <img
            className='hidden md:inline-flex h-32 lg:h-full' 
            src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png" 
            alt="" 
        />

    </main>
  )
}

export default Banner