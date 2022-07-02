import type { NextPage } from 'next'
import Head from 'next/head'
import Banner from '../components/Banner'
import Header from '../components/Header'

const Home: NextPage = () => {
	return (
		<div className="max-w-7xl mx-auto">
			<Head>
				<title>Medium Clone</title>
				<link rel="icon" href="https://miro.medium.com/1*m-R_BkNf1Qjr1YbyOIJY2w.png" />
			</Head>

			<Header/>

			<Banner/>

		</div>
	)
}

export default Home;
