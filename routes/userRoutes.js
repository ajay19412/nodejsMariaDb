const router = express.Router();
//controllers
const userController = require('../controllers/userController')

router.get('/', userController.getAllUsers);
router.post('/add', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/update', userController.updateUser);
router.post('/delete', userController.deleteUser);
router.post('/sendmail', userController.sendMail);

module.exports = router