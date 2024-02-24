import express, {Request, Response} from 'express';
import botConfig from "../../globals/botConfig";

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.render('index', { title: 'Discord Hell Bot Control Panel' });
});

router.get('/control-panel', (req: Request, res: Response) => {
  // Add control panel logic here
  res.render('controlPanel', { title: 'Control Panel', botConfig: botConfig });
});

// Add a new route for Discord OAuth2 callback
router.get('/auth/callback', (req: Request, res: Response) => {
  // This route will handle the callback logic
  // Extract data from the request (code, state, etc.) and use it for OAuth2 token exchange
  // More details can be found in the Discord API documentation
  // https://discord.com/developers/docs/topics/oauth2#authorization-code-grant
  console.log(req);
});

router.post('/setRenameAll', (req: Request, res: Response) => {
  botConfig.enableRenameAll = req.body.setRenameAll === 'on';

  res.redirect('/control-panel');
});

router.post('/setRoleJuggle', (req: Request, res: Response) => {
  botConfig.enableRoleJuggler = req.body.setRoleJuggle === 'on';

  res.redirect('/control-panel');
});

router.post('/setChannelJuggle', (req: Request, res: Response) => {
  botConfig.enableChannelJuggler = req.body.setChannelJuggle === 'on';

  res.redirect('/control-panel');
});


export default router;
