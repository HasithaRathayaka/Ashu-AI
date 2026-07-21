import Creation from '../models/Creation.js';
import User from '../models/User.js';

/**
 * Fetch creations created by authenticated user
 */
export const getUserCreations = async (req, res) => {
  try {
    const userId = req.auth?.userId || req.query.userId || 'anonymous_user';
    const creations = await Creation.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: creations.length,
      creations
    });
  } catch (error) {
    console.error('🔥 getUserCreations Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch user creations' });
  }
};

/**
 * Fetch public community creations
 */
export const getCommunityCreations = async (req, res) => {
  try {
    const creations = await Creation.find({ isPublic: true }).sort({ createdAt: -1 }).limit(50);

    res.status(200).json({
      success: true,
      count: creations.length,
      creations
    });
  } catch (error) {
    console.error('🔥 getCommunityCreations Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch community feed' });
  }
};

/**
 * Toggle like/unlike on a public creation
 */
export const toggleLikeCreation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.auth?.userId || req.body.userId || 'anonymous_user';

    const creation = await Creation.findById(id);
    if (!creation) {
      return res.status(404).json({ success: false, message: 'Creation document not found' });
    }

    const hasLiked = creation.likes.includes(userId);

    if (hasLiked) {
      creation.likes = creation.likes.filter((uid) => uid !== userId);
    } else {
      creation.likes.push(userId);
    }

    await creation.save();

    res.status(200).json({
      success: true,
      isLiked: !hasLiked,
      likesCount: creation.likes.length,
      likes: creation.likes
    });
  } catch (error) {
    console.error('🔥 toggleLikeCreation Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to toggle like' });
  }
};
