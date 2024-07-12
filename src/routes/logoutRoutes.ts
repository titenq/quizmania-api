import express from 'express';

const nameSession = process.env.NAME_SESSION as string;

const router = express.Router();

router.get('/', async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Erro ao destruir a sessão:', err);
      return res.status(500).json({ message: 'Erro ao fazer logout' });
    }

    res.clearCookie(nameSession);

    return res.status(200).json({ message: 'Sucesso ao fazer logout' });
  });
});

export default router;
