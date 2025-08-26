export interface BlogPost {
  _id: string;
  summary: string;
  title: string;
  desc: string;
  cover: string;
  route: string;
  fileUrl: string;
}

export interface Post {
  _id: string;
  caption: string;
  imageCaption: string | null;
  imageUrl: string | null;
}
