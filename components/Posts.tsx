import Link from 'next/link';
import React from 'react'
import { urlFor } from '../sanity';
import { Post } from '../types'

type Props = {
  posts: Post[];
}

function Posts({posts}: Props) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6'>
      {posts.map(post => (
        <Link key={post._id} href={`/post/${[post.slug.current]}`}>
          <div className='group overflow-hidden cursor-pointer border rounded-lg'>
            {post.mainImage && 
              <img 
                className='h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out' 
                src={urlFor(post.mainImage).url()} 
                alt=""
               />
            }
            <div className='flex justify-between items-center py-4 px-1 bg-white'>
              <div>
                <p className='text-lg font-bold'> {post.title} </p>
                <p className='text-xs'> {post.description} by {post.author.name} </p>
              </div>
              <img className='h-12 w-12 rounded-full object-cover' src={urlFor(post.author.image).url()} alt="" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Posts