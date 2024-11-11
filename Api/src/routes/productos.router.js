import { Router } from "express";
import IngredientManager from "../managers/IngredientManager.js";
import uploader from "../utils/uploader.js";
const router = Router();
const ProductosManager = new ProductoManager();
const express = require('express');  
// Ruta GET /api/products/ - Listar todos los productos, con opción de limitar  
router.get('/', getAll);  
// Ruta GET /api/products/:pid - Obtener un producto por ID  
router.get('/:pid', getOneById);  
module.exports = router;  