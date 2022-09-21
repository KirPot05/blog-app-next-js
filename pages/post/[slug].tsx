import { GetStaticProps } from 'next';
import Head from 'next/head';
import Header from '../../components/Header';
import { sanityClient, urlFor } from '../../sanity';
import { Post } from '../../types';
import PortableText from 'react-portable-text';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';

type Props = {
    post: Post;
}

type InputFormTypes = {
    _id: string;
    name: string;
    email: string;
    comment: string;
}

function Post({ post }: Props) {
    console.log(post)
    const [submitted, setSubmitted] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<InputFormTypes>();

    const postComment: SubmitHandler<InputFormTypes> = async (data) => {
        try {
            setSubmitted(false);
            const res = await fetch('/api/comments/create', {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(data)
            });

            const resp = await res.json();
            if(!resp.success) throw new Error(resp.message);
            setSubmitted(true);
            alert(resp.message);
        } catch (err) {
            console.log(err);
            setSubmitted(false);
        }
    }

    return (
        <main className='max-w-7xl mx-auto'>
            <Head>
                <title>{post.title} | Medium</title>
            </Head>

            <Header />

            <img className='w-full h-60 object-cover' src={urlFor(post.mainImage).url()} alt="" />

            <article className='max-w-3xl mx-auto p-4'>
                <h1 className='text-3xl lg:text-4xl mt-10 mb-3 font-bold'> {post.title} </h1>
                <h2 className='text-xl font-light text-gray-500 mb-2'> {post.description} </h2>

                <div className='flex items-center space-x-4 mt-5'>
                    <img className='h-10 w-10 rounded-full object-cover' src={urlFor(post.author.image).url()} alt="" />
                    <p className='font-extralight text-sm tracking-wide'> Blog post by <span className='text-green-600'> {post.author.name} </span> | Published on {new Date(post._createdAt).toDateString()} </p>
                </div>

                <div className='mt-10'>
                    <PortableText
                        dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
                        projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                        content={post.body}
                        serializers={
                            {
                                h1: (props: any) => (
                                    <h1 className='text-2xl font-bold my-5' {...props} />
                                ),

                                h2: (props: any) => (
                                    <h2 className='text-xl font-bold my-5' {...props} />
                                ),

                                li: (props: any) => (
                                    <li className='ml-4 list-disc' {...props} />
                                ),

                                link: ({ href, children }: any) => (
                                    <a href={href} className="text-blue-500 hover:underline">
                                        {children}
                                    </a>
                                ),
                            }
                        }
                    />
                </div>
            </article>

            <hr className='max-w-lg my-5 mx-auto border border-yellow-500' />

            {
                submitted ? (
                    <div className='flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto'>
                        <h3 className='text-3xl font-bold'>Thank you posting!</h3>
                        <p>Once it's approved it will be shown below!</p>
                    </div>
                ):(
                <form onSubmit={handleSubmit(postComment)} className='flex flex-col p-5 max-w-2xl mx-auto mb-10'>
                    <h3 className='text-sm text-yellow-500'> Enjoyed this article? </h3>
                    <h2 className='text-3xl font-bold'> Leave a comment below! </h2>
                    <hr className='py-3 mt-2' />

                    <input {...register("_id")} type="hidden" name='_id' value={post._id} />

                    <label className='flex flex-col mb-5 space-y-2'>
                        <span className='text-gray-700'>Name</span>
                        <input {...register("name", { required: true })} name="name" placeholder='Enter your name' type="text" className='p-2 shadow border rounded outline-none focus:ring-2 ring-yellow-500' />
                    </label>

                    <label className='flex flex-col mb-5 space-y-2'>
                        <span className='text-gray-700'>Email</span>
                        <input {...register("email", { required: true })} name="email" placeholder='example@sample.com' type='email' className='p-2 shadow border rounded outline-none focus:ring-2 ring-yellow-500' />
                    </label>

                    <label className='flex flex-col mb-5 space-y-2'>
                        <span className='text-gray-700'>Comment</span>
                        <textarea {...register("comment", { required: true })} name="comment" placeholder='Enter your views...' className='p-2 shadow border rounded outline-none  focus:ring-2 ring-yellow-500' cols={50} rows={5}></textarea>
                    </label>

                    {/* Errors after validation of input data */}
                    <div className='p-2 space-y-3 mb-3'>
                        {errors.name && <p className='text-red-500 text-sm'> Name field is required </p>}
                        {errors.email && <p className='text-red-500 text-sm'> Email is required </p>}
                        {errors.comment && <p className='text-red-500 text-sm'> Comment is required </p>}
                    </div>

                    <input type="submit" disabled={submitted} className={`shadow text-lg  focus:shadow-outline focus:outline-none text-white font-semibold py-2 px-4 rounded bg-yellow-500 hover:bg-yellow-400 cursor-pointer" }`}  value="Submit" />
                </form>)}
                
                {/* Comments */}
                <div className='flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-lg space-y-2 border'>
                    <h3 className='text-4xl font-bold'>Comments</h3>
                    <hr className='mb-2 bg-gray-100' />
                    <div className='space-y-3'>
                        {post.comments.map((comment) => (
                            <div key={comment._id}>
                                <p> <span className='text-yellow-600'>{comment.name}</span>: {comment.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
        </main>
    )
}

export default Post;

export const getStaticPaths = async () => {
    const query = `*[_type == "post"]{
        _id,
        slug {
            current
        }
    }`

    const posts = await sanityClient.fetch(query);

    const paths = posts.map((post: Post) => ({
        params: {
            slug: post.slug.current
        }
    }))

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {

    const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title, 
        author -> {
            name, 
            image
        },
        "comments": *[
            _type == "comment" && post._ref == ^._id && approved == true
        ],
        description, 
        mainImage,
        slug, 
        body
    }`

    const post = await sanityClient.fetch(query, {
        slug: params?.slug
    });

    if (!post) {
        return {
            notFound: true
        }
    }

    return {
        props: {
            post,
        },
        revalidate: 120 // Updates old cached version of page after 60s
    }
}