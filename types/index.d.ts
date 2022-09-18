export interface Post {
  _id: string;
  _createdAt: string;
  title: string;
  description: string;
  slug: {
    current: string;
  };
  author: {
    name: string;
    image: string;
  };

  mainImage: {
    asset: {
      url: string;
    };
  };
  body: object[];
}
