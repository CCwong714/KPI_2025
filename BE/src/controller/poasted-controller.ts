import { Request, Response } from 'express';
import { IPosted, Posted } from '../models/Posted';
import { Like } from '../models/Like';
export interface IAuthRequest extends Request<{ id?: string }, {}, IPosted> {
  user?: { userId: string; username: string }; // 从 authMiddleware 注入
}

const postAddPosted = async (req: IAuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { user, body } = req;
    const { userId, username } = user;
    const { postTitle, postBody } = body;

    if (!postTitle?.trim() || !postBody?.trim()) {
      res.status(400).json({
        success: false,
        message: 'Post title and body are required and cannot be empty',
      });
      return;
    }
    const generateId = () =>
      Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const newPost = new Posted({
      id: generateId(),
      userId,
      username,
      postTitle,
      postBody,
      status: 'active',
    });

    await newPost.save();

    res.status(200).json({
      success: true,
      message: 'Post added successfully',
      data: newPost,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'Some error occured! Please try again',
    });
    return;
  }
};

const getPostById = async (req: IAuthRequest, res: Response) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      res.status(400).json({ success: false, message: 'Post id is required' });
      return;
    }

    const post = await Posted.findById(postId);
    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    const likeCount = await Like.countDocuments({ postId });
    const isLiked = req.user
      ? !!(await Like.findOne({ postId, userId: req.user.userId }))
      : false;

    res.status(200).json({
      success: true,
      message: 'Fetched post successfully',
      data: { ...post.toObject(), likeCount, isLiked },
    });
    return;
  } catch (err) {
    console.error('Error in getPostById:', err);
    res.status(500).json({
      success: false,
      message: 'Some error occurred while fetching the post',
    });
    return;
  }
};

const getAllPosted = async (req: IAuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const posts = await Posted.find({ userId: userId }).sort({
      createdAt: -1,
    });

    const likes = await Like.find({ userId: userId });
    const likedPostIds = likes.map((like) => like.postId.toString());

    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const likeCount = await Like.countDocuments({ postId: post._id });
        const isLiked = likedPostIds.includes(post._id.toString());
        return {
          ...post.toObject(),
          likeCount,
          isLiked,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Fetched your posts successfully',
      data: postsWithLikes,
    });
  } catch (err) {
    console.error('Error in getAllPosted:', err);
    res.status(500).json({
      success: false,
      message: 'Some error occurred while fetching posts',
    });
  }
};

const deletePost = async (req: IAuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const postId = req.params.id;
    if (!postId) {
      res.status(400).json({ success: false, message: 'Post id is required' });
      return;
    }

    const post = await Posted.findById(postId);
    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    if (post.userId !== req.user.userId) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete your own post',
      });
      return;
    }

    await Posted.deleteOne({ _id: postId });

    await Like.deleteMany({ postId });

    res
      .status(200)
      .json({ success: true, message: 'Post deleted successfully' });
    return;
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({
      success: false,
      message: 'Some error occurred while deleting the post',
    });
    return;
  }
};

const updatePost = async (req: IAuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const postId = req.params.id;
    const { postTitle, postBody, status } = req.body;

    if (!postId) {
      res.status(400).json({ success: false, message: 'Post id is required' });
      return;
    }

    const post = await Posted.findById(postId);
    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    if (post.userId !== req.user.userId) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: You can only update your own post',
      });
      return;
    }

    if (postTitle?.trim()) post.postTitle = postTitle;
    if (postBody?.trim()) post.postBody = postBody;
    if (status) post.status = status;

    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post,
    });
    return;
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({
      success: false,
      message: 'Some error occurred while updating the post',
    });
    return;
  }
};

const toggleLikePost = async (req: IAuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { userId } = req.user;
    const postId = req.params.id;

    if (!postId) {
      res
        .status(400)
        .json({ success: false, message: 'Missing postId in params' });
      return;
    }

    const post = await Posted.findById(postId);
    if (!post) {
      res.status(404).json({ success: false, message: 'Post not found' });
      return;
    }

    const existingLike = await Like.findOne({ userId, postId });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      res.status(200).json({ success: true, message: 'Unliked successfully' });
    } else {
      const newLike = new Like({ userId, postId });
      await newLike.save();
      res.status(200).json({ success: true, message: 'Liked successfully' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Some error occurred while toggling like',
    });
  }
};

export {
  postAddPosted,
  getPostById,
  getAllPosted,
  deletePost,
  updatePost,
  toggleLikePost,
};
