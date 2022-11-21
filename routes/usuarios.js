
const { Router } = require('express');
const { check } = require('express-validator');


const {validarCampos} = require('../middlewares/validar-campos')
const { esRolValido, emailExiste, existeUsuarioById } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosDelete, 
        usuariosPatch } = require('../controllers/usuarios');

const router = Router();



router.get('/', usuariosGet );

router.put('/:id',[
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioById ),
        check('rol').custom( esRolValido ),
        validarCampos
], usuariosPut);

router.post('/', [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'El password debe ser de mas de 6 letras').isLength({min: 6}),
        check('correo', 'El correo no es valido').isEmail(),
        check('correo').custom( emailExiste ),
        // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('rol').custom( esRolValido ),
        validarCampos
], usuariosPost);

router.patch('/', usuariosPatch);

router.delete('/:id',[
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom( existeUsuarioById ),
        validarCampos 
], usuariosDelete);





module.exports = router;