import Creation from '../models/Creation.js';
import User from '../models/User.js';

/**
 * Fetch creations created by authenticated user
 */
export const getUserCreations = async (req, res) => {
  try {
    const userId = req.auth?.userId || req.query.userId;
    // If userId is present and not 'anonymous_user', filter by userId; otherwise return recent creations
    const query = (userId && userId !== 'anonymous_user') ? { userId } : {};
    const creations = await Creation.find(query).sort({ createdAt: -1 }).limit(50);

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
