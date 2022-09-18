import type { NextPage } from 'next'
import Head from 'next/head'
import Banner from '../components/Banner'
import Header from '../components/Header'
import Posts from '../components/Posts'
import { sanityClient } from '../sanity'
import { Post } from '../types'


interface Props {
	posts: Post[];
}

const Home: NextPage<Props> = ({posts}: Props) => {
	return (
		<div className="max-w-7xl mx-auto">
			<Head>
				<title>Medium Clone</title>
				<link rel="icon" href="https://miro.medium.com/1*m-R_BkNf1Qjr1YbyOIJY2w.png" />
			</Head>

			<Header/>

			<Banner/>

			{/* Displaying all the posts of the user */}
			<Posts posts={posts}/>

		</div>
	)
}

export default Home;

export const getServerSideProps = async () => {
	const query = `*[_type == "post"]{
		_id,
		title, 
		slug, 
		description,
		mainImage,
		publishedAt,
		author -> {
		  name, 
		  image
		},
		body
	}`;

	const posts = await sanityClient.fetch(query);

	return {
		props: {
			posts,
		}
	}

}
