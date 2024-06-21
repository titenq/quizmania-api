import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  const response = { ping: 'pong' };

  res.json(response);
});

export default router;
