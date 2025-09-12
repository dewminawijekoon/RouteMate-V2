import { errorResponse } from '../utils/helpers.js';

// Global error handler middleware
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  // Handle different types of errors
  if (err.name === 'ValidationError') {
    return res.status(400).json(errorResponse(err.message, 400));
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json(errorResponse('Unauthorized', 401));
  }
  
  if (err.name === 'NotFoundError') {
    return res.status(404).json(errorResponse('Resource not found', 404));
  }
  
  // Default server error
  res.status(500).json(errorResponse('Internal server error', 500));
}

// Async error wrapper to catch async errors
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Request logging middleware
export function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
}

// CORS middleware
export function corsHandler(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
}

// Validation middleware
export function validateFields(requiredFields) {
  return (req, res, next) => {
    const missing = [];
    
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }
    
    if (missing.length > 0) {
      return res.status(400).json(errorResponse(`Missing required fields: ${missing.join(', ')}`, 400));
    }
    
    next();
  };
}