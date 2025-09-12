import express from 'express';
import { supabase } from '../utils/database.js';
import AuthService from '../services/AuthService.js';
import { validateFields, asyncHandler } from '../middleware/index.js';
import { errorResponse } from '../utils/helpers.js';

const router = express.Router();

// User registration endpoint
router.post('/signup', validateFields(['email', 'password', 'name']), asyncHandler(async (req, res) => {
  const { email, password, name, phone } = req.body;

  try {
    // Validate email format
    if (!AuthService.validateEmail(email)) {
      return res.status(400).json(errorResponse('Invalid email format', 400));
    }

    // Validate password strength
    const passwordValidation = AuthService.validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json(errorResponse(passwordValidation.message, 400));
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', email)
      .maybeSingle();

    if (checkError) {
      console.error('Database check error:', checkError);
      return res.status(500).json(errorResponse('Database error', 500));
    }

    if (existingUser) {
      return res.status(409).json(errorResponse('User already exists with this email', 409));
    }

    // Hash password
    const hashedPassword = await AuthService.hashPassword(password);

    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        gamification_points: 0
      })
      .select('user_id, name, email, phone, profile_picture, gamification_points, created_at')
      .single();

    if (insertError) {
      console.error('User creation error:', insertError);
      return res.status(500).json(errorResponse('Failed to create user', 500));
    }

    // Generate JWT token
    const token = AuthService.generateToken(newUser);

    // Return user data and token
    res.status(201).json({
      ok: true,
      message: 'User created successfully',
      token,
      user: AuthService.sanitizeUser(newUser)
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json(errorResponse('Internal server error', 500));
  }
}));

// User login endpoint
router.post('/login', validateFields(['email', 'password']), asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate email format
    if (!AuthService.validateEmail(email)) {
      return res.status(400).json(errorResponse('Invalid email format', 400));
    }

    // Get user from database
    const { data: user, error: getUserError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (getUserError) {
      console.error('Database error:', getUserError);
      return res.status(500).json(errorResponse('Database error', 500));
    }

    if (!user) {
      return res.status(401).json(errorResponse('Invalid email or password', 401));
    }

    // Verify password
    const isPasswordValid = await AuthService.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json(errorResponse('Invalid email or password', 401));
    }

    // Generate JWT token
    const token = AuthService.generateToken(user);

    // Update last login timestamp (optional)
    await supabase
      .from('users')
      .update({ updated_at: new Date().toISOString() })
      .eq('user_id', user.user_id);

    // Return user data and token
    res.json({
      ok: true,
      message: 'Login successful',
      token,
      user: AuthService.sanitizeUser(user)
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(errorResponse('Internal server error', 500));
  }
}));

// Get current user profile (protected route)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json(errorResponse('Access token required', 401));
    }

    // Verify token
    const decoded = AuthService.verifyToken(token);
    const userId = decoded.userId;

    // Get user from database
    const { data: user, error: getUserError } = await supabase
      .from('users')
      .select('user_id, name, email, phone, profile_picture, gamification_points, created_at, updated_at')
      .eq('user_id', userId)
      .single();

    if (getUserError) {
      console.error('Database error:', getUserError);
      return res.status(500).json(errorResponse('Database error', 500));
    }

    if (!user) {
      return res.status(404).json(errorResponse('User not found', 404));
    }

    res.json({
      ok: true,
      user: AuthService.sanitizeUser(user)
    });

  } catch (error) {
    console.error('Get profile error:', error);
    if (error.message === 'Token verification failed') {
      return res.status(403).json(errorResponse('Invalid or expired token', 403));
    }
    res.status(500).json(errorResponse('Internal server error', 500));
  }
});

// Change password endpoint (protected route)
router.post('/change-password', validateFields(['currentPassword', 'newPassword']), async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json(errorResponse('Access token required', 401));
    }

    // Verify token
    const decoded = AuthService.verifyToken(token);
    const userId = decoded.userId;

    const { currentPassword, newPassword } = req.body;

    // Validate new password
    const passwordValidation = AuthService.validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json(errorResponse(passwordValidation.message, 400));
    }

    // Get current user
    const { data: user, error: getUserError } = await supabase
      .from('users')
      .select('password')
      .eq('user_id', userId)
      .single();

    if (getUserError || !user) {
      return res.status(404).json(errorResponse('User not found', 404));
    }

    // Verify current password
    const isCurrentPasswordValid = await AuthService.verifyPassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json(errorResponse('Current password is incorrect', 401));
    }

    // Hash new password
    const hashedNewPassword = await AuthService.hashPassword(newPassword);

    // Update password in database
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        password: hashedNewPassword,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Password update error:', updateError);
      return res.status(500).json(errorResponse('Failed to update password', 500));
    }

    res.json({
      ok: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    if (error.message === 'Token verification failed') {
      return res.status(403).json(errorResponse('Invalid or expired token', 403));
    }
    res.status(500).json(errorResponse('Internal server error', 500));
  }
});

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json(errorResponse('Access token required', 401));
    }

    // Verify token (even if expired, we can still decode it)
    const decoded = AuthService.verifyToken(token);
    const userId = decoded.userId;

    // Get fresh user data
    const { data: user, error: getUserError } = await supabase
      .from('users')
      .select('user_id, name, email, phone, profile_picture, gamification_points')
      .eq('user_id', userId)
      .single();

    if (getUserError || !user) {
      return res.status(404).json(errorResponse('User not found', 404));
    }

    // Generate new token
    const newToken = AuthService.generateToken(user);

    res.json({
      ok: true,
      token: newToken,
      user: AuthService.sanitizeUser(user)
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(403).json(errorResponse('Invalid or expired token', 403));
  }
});

export default router;