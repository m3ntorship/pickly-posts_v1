import * as express from 'express';
import Post from './posts.interface';

class PostsController {
  public path = '/posts';
  public router = express.Router();

  private posts: Post[] = [
    {
      author: 'asdasd',
      caption: 'this is caption',
      isAnonymous: 'false'
    }
  ];

  constructor () {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.post(this.path, this.createPost);
  }

  getAllPosts = (req: express.Request, res: express.Response) => {
    res.send(this.posts);
  }

  createPost = (req:express.Request, res: express.Response) => {
    const post: Post = req.body;
    this.posts.push(post);
    res.send(post);
  }
}

export default PostsController;